import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FirebaseChatService } from '../../../services/firebase-chat.service';
import { IntentProvider } from '../../../providers/intent.provider';
import { Message } from '../../../services/interfaces/message';
import { StorageService } from '../../../services/storage.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

    isSingle: boolean;
    init = false;
    user: any = {};
    receiver: any = {};
    messages: any[] = [];
    message = '';
    sending = false;
    loading = true;

    constructor(private modalController: ModalController,
                private intentProvider: IntentProvider,
                private storage: StorageService,
                private chatService: FirebaseChatService) {
    }

    async ngOnInit() {
        this.user = await this.storage.getDriver();
        if (this.intentProvider.chatReceiverUser) {
            this.receiver = this.intentProvider.chatReceiverUser;
            this.intentProvider.chatReceiverUser = undefined;
            this.isSingle = true;
        }
        if (this.intentProvider.chatGroupUsers) {
            this.receiver = this.intentProvider.chatGroupUsers;
            this.intentProvider.chatGroupUsers = undefined;
            this.isSingle = false;
        }
        this.getMessages();
    }

    getMessages() {
        this.loading = true;
        if (this.isSingle) {
            this.chatService.getAllChatMessages(String(this.user.id), this.receiver.id)
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
                    if (!this.init) {
                        if (this.messages.length) {
                            this.chatService.putChatRead(String(this.user.id), this.receiver.id).then();
                        }
                        this.init = true;
                    }
                });
        } else {
            console.log('-> this.receiver', this.receiver);
            this.messages = [];
            this.loading = false;
        }
    }

    sendMessage() {
        if (this.message) {
            this.sending = true;
            const data: Message = {
                message: this.message,
                date: new Date(),
                senderId: this.user.id,
            };

            this.chatService.sendMessage(this.user, this.receiver, data)
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
