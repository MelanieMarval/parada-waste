import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CreateChatComponent } from './create-chat/create-chat.component';
import { FirebaseChatService } from '../../services/firebase-chat.service';
import { IntentProvider } from '../../providers/intent.provider';
import { StorageService } from '../../services/storage.service';
import { ToastProvider } from '../../providers/toast.provider';

@Component({
    selector: 'app-chat',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {

    user: any;
    loading = true;
    chats: any[] = [];
    currentDate = new Date();

    constructor(private modalController: ModalController,
                private router: Router,
                private chatService: FirebaseChatService,
                private intentProvider: IntentProvider,
                private storage: StorageService,
                private toast: ToastProvider) {
    }

    async ngOnInit() {
        this.user = await this.storage.getDriver();
        this.getChats();
    }

    getChats() {
        this.loading = true;
        // try {
            this.chatService.getAllMyChats(String(this.user.id))
                .subscribe((res: any) => {
                    const newChats = [];
                    res.forEach(x => {
                        const chat = x.payload.doc.data();
                        chat.id = x.payload.doc.id;
                        chat.lastDate = chat.lastDate ? chat.lastDate.toDate() : chat.lastDate;
                        newChats.push(chat);
                    });
                    this.chats = newChats.sort((a, b) => b.lastDate - a.lastDate);
                    this.loading = false;
                    console.log('-> this.chats', this.chats);
                });
        // } catch (e) {
        //     this.toast.handleError(-1, 'We cannot process this request, please try restarting the app');
        //     this.loading = false;
        // }
    }

    openChat(receiver) {
        console.log('-> receiver', receiver);
        this.intentProvider.chatReceiverUser = {id: receiver.id, name: receiver.name};
        this.router.navigate(['tabs/chats', receiver.id]);
    }

    async newChat() {
        const modal = await this.modalController.create({
            component: CreateChatComponent,
            cssClass: 'my-custom-class'
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
