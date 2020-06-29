import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CreateChatComponent } from './create-chat/create-chat.component';
import { FirebaseChatService } from '../../services/firebase-chat.service';
import { IntentProvider } from '../../providers/intent.provider';
import { StorageService } from '../../services/storage.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {

    user: any;
    loading = true;
    chatsSingle: any[] = [];
    chatsGroup: any[] = [];
    chats: any[] = [];

    constructor(private modalController: ModalController,
                private router: Router,
                private chatService: FirebaseChatService,
                private intentProvider: IntentProvider,
                private storage: StorageService) {
    }

    async ngOnInit() {
        this.user = await this.storage.getDriver();
        this.getChats();
    }

    async getChats() {
        await this.getMyChats();
        await this.getMyGroups();
    }

    getMyChats() {
        this.loading = true;
        this.chatService.getMyChats(String(this.user.id))
            .subscribe((res: any) => {
                this.chatsSingle = this.mapChats(res);
                this.chats = this.chatsSingle.concat(this.chatsGroup).sort((a, b) => b.lastDate - a.lastDate);
                this.loading = false;
            });
    }

    getMyGroups() {
        this.loading = true;
        this.chatService.getMyGroups(String(this.user.id))
            .subscribe((res: any) => {
                this.chatsGroup = this.mapChats(res);
                this.chats = this.chatsSingle.concat(this.chatsGroup).sort((a, b) => b.lastDate - a.lastDate);
                this.loading = false;
            });
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
