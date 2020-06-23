import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FirebaseChatService } from '../../../services/firebase-chat.service';
import { IntentProvider } from '../../../providers/intentProvider';
import { Message } from '../../../services/interfaces/message';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

    user: any;
    receiverUser: any;
    messages: any[] = [];
    message = '';
    sending = false;
    loading = true;

    constructor(private modalController: ModalController,
                private intentProvider: IntentProvider,
                private chatService: FirebaseChatService) {
    }

    ngOnInit() {
        this.user = this.intentProvider.userParadaWaste;
        this.receiverUser = this.intentProvider.chatReceiverUser;
        this.getMessages();
        this.chatService.putChatRead(this.user.id, this.receiverUser.id).then();
    }

    getMessages() {
        this.loading = true;
        this.chatService.getAllChatMessages(this.user.id, this.receiverUser.id)
            .subscribe((res: any) => {
                const newMessages = [];
                res.forEach(x => {
                    const sms = x.payload.doc.data();
                    sms.date = sms.date.toDate();
                    newMessages.push(sms);
                });
                this.messages = newMessages.sort((a, b) => a.date - b.date);
                console.log('-> this.messages', this.messages);
                this.loading = false;
            });
    }

    sendMessage() {
        if (this.message) {
            this.sending = true;
            const data: Message = {
                message: this.message,
                date: new Date(),
                senderId: this.user.id
            };

            this.chatService.sendMessage(this.user, this.receiverUser, data)
                .then(() => {
                    this.message = '';
                    this.sending = false;
                    // console.log('-> res', res.collection);
                    // this.messages = newMessages;
                }).catch((error) => {
                    this.sending = false;
                    console.log(error);
                });
        }
    }
}
