import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseChatService } from '../../../services/firebase-chat.service';
import { IntentProvider } from '../../../providers/intent.provider';
import { StorageService } from '../../../services/storage.service';
import { ToastProvider } from '../../../providers/toast.provider';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-create-chat',
    templateUrl: './create-chat.component.html',
    styleUrls: ['./create-chat.component.scss'],
})
export class CreateChatComponent implements OnInit {

    user: any;
    users: any[] = [];
    loading = true;
    searchUser: string;
    typeChat = 'single';

    constructor(private modalController: ModalController,
                private router: Router,
                private translate: TranslateService,
                private chatService: FirebaseChatService,
                private storage: StorageService,
                private intentProvider: IntentProvider,
                private toast: ToastProvider,
                private alertController: AlertController) {
    }

    async ngOnInit() {
        this.user = await this.storage.getDriver();
        // this.user = user ? user : {id: '5'};
        this.getUsers();
    }

    private getUsers() {
        this.loading = true;
        this.chatService.getAllUsers()
            .subscribe((res: any) => {
                const newUsers = [];
                res.forEach(x => {
                    const user = x.payload.doc.data();
                    user.id = x.payload.doc.id;
                    if (user.id !== this.user.id) {
                        newUsers.push(user);
                    }
                });
                this.users = newUsers;
                this.loading = false;
                console.log('-> this.users', this.users);
            });
    }

    async dismissModal() {
        await this.modalController.dismiss();
    }

    createChat(receiver) {
        this.intentProvider.chatReceiverUser = {id: receiver.id, name: receiver.name};
        this.router.navigate(['tabs/chats', receiver.id])
            .then(() => this.modalController.dismiss());
    }

    validateGroup() {
        const usersGroup = this.users.filter(user => {
            if (user.group) {
                return user;
            }
        });
        if (!usersGroup.length) {
            this.toast.handleError(-1, 'You must select the users to create the group');
            return;
        }
        const listMembers = usersGroup.map(user => {
            return {id: user.id};
        });
        this.createGroup(listMembers);
    }

    async createGroup(listMembers) {
        const text = await this.translate.get('button').toPromise();
        const alert = await this.alertController.create({
            cssClass: 'prompt-primary',
            header: 'Give your group a name',
            inputs: [{
                id: 'firstInput',
                name: 'name',
                type: 'text',
                value: '',
            }],
            buttons: [
                {
                    text: text.cancel,
                    role: 'cancel',
                    cssClass: 'light',
                    handler: () => {
                        this.intentProvider.chatGroupUsers = undefined;
                    },
                }, {
                    text: text.save,
                    cssClass: 'light',
                    handler: (alertData) => {
                        console.log(alertData);
                        if (alertData.name) {
                            this.intentProvider.chatGroupUsers = {
                                name: alertData.name,
                                members: listMembers
                            };
                            this.router.navigate(['tabs/chats', this.user.id])
                                .then(() => this.modalController.dismiss());
                        }
                    },
                },
            ],
        });
        await alert.present().then(() => {
            const firstInput: any = document.querySelector('ion-alert input');
            firstInput.focus();
            return;
        });
    }

    changeSegment($event: CustomEvent) {
        this.typeChat = $event.detail.value;
    }

}
