import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FirebaseChatService } from '../../../services/firebase-chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

    receiverUser: any;
    messages: any[] = [];
    message = '';
    sending = false;
    loading = true;

    constructor(private modalController: ModalController,
                private route: ActivatedRoute,
                private chatService: FirebaseChatService) {
    }

    ngOnInit() {
        console.log('-> this.route.snapshot.params.id', this.route.snapshot.params.id);
        this.receiverUser = this.route.snapshot.params.id;
        this.getMessages();
    }

    getMessages() {
        this.chatService.getAllChatMessages('5', this.receiverUser)
            .subscribe((res: any) => {
                console.log('-> res', res);
                const newMessages = [];
                res.forEach(x => {
                    newMessages.push(x.payload.doc.data());
                });
                this.messages = newMessages;
                this.loading = false;
            });
    }

    async closeChat() {
        await this.modalController.dismiss();
    }

    sendMessage() {
        console.log(this.message);
        this.sending = true;
        setTimeout(() => {
            this.message = '';
            this.sending = false;
        }, 3000);
    }
}
