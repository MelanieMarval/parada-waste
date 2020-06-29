import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { FirebaseChatService } from '../../../services/firebase-chat.service';
import { IntentProvider } from '../../../providers/intent.provider';
import { Message } from '../../../services/interfaces/message';
import { StorageService } from '../../../services/storage.service';
import { ToastProvider } from '../../../providers/toast.provider';
import { CreateChatComponent } from '../create-chat/create-chat.component';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

    @ViewChild('content') private content: IonContent;
    isSingle: boolean;
    init = false;
    sending = false;
    loading = true;
    user: any = {};
    receiver: any = {};
    messages: any[] = [];
    message = '';
    action: number;

    constructor(private modalController: ModalController,
                private intentProvider: IntentProvider,
                private storage: StorageService,
                private chatService: FirebaseChatService,
                private toast: ToastProvider) {
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
            this.chatService.getMessagesByChat(String(this.user.id), this.receiver.id)
                .subscribe((res: any) => {
                    this.messages = this.mapMessages(res);
                    this.loading = false;
                    if (!this.init) {
                        if (this.messages.length) {
                            this.chatService.putChatRead(String(this.user.id), this.receiver.id).then();
                        }
                        this.init = true;
                    }
                    setTimeout(() => {
                        this.content.scrollToBottom(300).then();
                    }, 100);
                }, error => {
                    console.log('-> error', error);
                    this.toast.handleError(0);
                });
        } else {
            console.log('-> this.receiver', this.receiver);
            this.chatService.getMessagesByGroup(this.receiver.id)
                .subscribe((res: any) => {
                    this.messages = this.mapMessages(res);
                    this.loading = false;
                    if (!this.init) {
                        if (this.messages.length) {
                            this.chatService.putChatReadGroup(this.receiver.id, String(this.user.id)).then();
                        }
                        this.init = true;
                    }
                    setTimeout(() => {
                        this.content.scrollToBottom(300).then();
                    }, 100);
                }, error => {
                    console.log('-> error', error);
                    this.toast.handleError(0);
                });
        }
    }

    mapMessages(res) {
        const newMessages = [];
        res.forEach(x => {
            const sms = x.payload.doc.data();
            sms.date = sms.date.toDate();
            newMessages.push(sms);
        });
        return newMessages.sort((a, b) => a.date - b.date);
    }

    sendMessage() {
        if (!this.message) {
            return;
        }
        this.sending = true;
        const data: Message = {
            message: this.message,
            date: new Date(),
            senderId: this.user.id,
        };
        if (this.isSingle) {
            this.sendMessageSingle(data);
        } else {
            this.sendMessageGroup(data);
        }
    }

    sendMessageSingle(data: any) {
        console.log('-> 0', typeof this.user.id, typeof this.receiver.id);
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

    sendMessageGroup(data: Message) {
        data.senderName = this.user.name;
        const listUnread = {};
        for (const membersKey of this.receiver.members) {
            if (membersKey !== String(this.user.id)) {
                listUnread[membersKey] = true;
            }
        }
        this.chatService.sendMessageGroup(this.receiver.id, data, listUnread)
            .then(() => {
                this.message = '';
                this.sending = false;
            }).catch((error) => {
            this.sending = false;
            console.log('-> error', error);
        });
    }

    isToday(fireDate) {
        const date = new Date();
        const lastDate = fireDate.getDay() + '-' + fireDate.getDate() + '-' + fireDate.getFullYear();
        const currentDate = date.getDay() + '-' + date.getDate() + '-' + date.getFullYear();

        return lastDate === currentDate;
    }

    private deleteChat() {
        if (this.isSingle) {
            // this.chatService.deleteChat(String(this.user.id), this.receiver.id)
            //     .then(res => {
            //         console.log('-> res', res);
            //     });
        } else {

        }
    }

    private async editMembers() {
        const modal = await this.modalController.create({
            component: CreateChatComponent,
            cssClass: 'my-custom-class',
            componentProps: {group: this.receiver},
        });
        return await modal.present();
    }

    changeAction($event: any) {
        console.log('-> $event', $event);
        switch ($event.detail.value) {
            case 0:
                this.editMembers();
                break;
            case 1:
                this.deleteChat();
                break;
        }
        this.action = null;
    }
}
