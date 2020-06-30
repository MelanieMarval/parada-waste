import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CreateChatComponent } from './create-chat/create-chat.component';
import { FirebaseChatService } from '../../services/firebase-chat.service';
import { IntentProvider } from '../../providers/intent.provider';
import { StorageService } from '../../services/storage.service';
import { ToastProvider } from '../../providers/toast.provider';
import { Chat } from '../../services/interfaces/chat';

@Component({
    selector: 'app-chat',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {

    user: any;
    loading = true;
    chatsSingle: Chat[] = [];
    chatsGroup: Chat[] = [];
    chats: Chat[] = [];

    constructor(private modalController: ModalController,
                private router: Router,
                private chatService: FirebaseChatService,
                private intentProvider: IntentProvider,
                private storage: StorageService,
                private toast: ToastProvider) {
    }

    async ngOnInit() {
        this.user = await this.storage.getDriver();
        this.user.id = String(this.user.id);
        this.getChats();
    }

    async getChats() {
        await this.getMyChats();
        await this.getMyGroups();
    }

    getMyChats() {
        this.loading = true;
        this.chatService.getMyChats(this.user.id)
            .subscribe((res: any) => {
                this.chatsSingle = this.mapChats(res);
                this.chats = this.chatsSingle.concat(this.chatsGroup).sort((a, b) => b.lastDate - a.lastDate);
                console.log('-> this.chats', this.chats);
                this.loading = false;
            }, error => this.toast.handleError(0));
    }

    getMyGroups() {
        this.loading = true;
        this.chatService.getMyGroups(this.user.id)
            .subscribe((res: any) => {
                this.chatsGroup = this.mapChats(res);
                this.chats = this.chatsSingle.concat(this.chatsGroup).sort((a, b) => b.lastDate - a.lastDate);
                console.log('-> this.chats', this.chats);
                this.loading = false;
            }, error => this.toast.handleError(0));
    }

    mapChats(response) {
        const newChats = [];
        response.forEach(x => {
            const chat = x.payload.doc.data();
            chat.id = x.payload.doc.id;
            chat.lastDate = chat.lastDate ? chat.lastDate.toDate() : chat.lastDate;
            newChats.push(chat);
        });
        return newChats;
    }

    openChat(isGroup: boolean, receiver: any) {
        console.log('-> receiver', receiver);
        if (isGroup) {
            this.intentProvider.chatGroupUsers = receiver;
        } else {
            this.intentProvider.chatReceiverUser = {id: receiver.id, name: receiver.name};
        }
        this.router.navigate(['tabs/chats', receiver.id]);
    }

    async newChat() {
        const modal = await this.modalController.create({
            component: CreateChatComponent,
            cssClass: 'my-custom-class',
        });
        return await modal.present();
    }

    isToday(fireDate) {
        const date = new Date();
        const lastDate = fireDate.getDay() + '-' + fireDate.getDate() + '-' + fireDate.getFullYear();
        const currentDate = date.getDay() + '-' + date.getDate() + '-' + date.getFullYear();

        return lastDate === currentDate;
    }

}
