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
    group: any;

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
            .then((res: any) => {
                const newUsers = [];
                res.forEach(x => {
                    const user = x.data();
                    user.id = x.id;
                    if (user.id !== String(this.user.id)) {
                        newUsers.push(user);
                    }
                });
                this.users = newUsers;
                if (this.group) {
                    this.typeChat = 'group';
                    this.users.map(user => {
                        user.group = !!this.group.members.filter(id => id === user.id).length;
                    });
                }
                this.loading = false;
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
        const listMembers: string[] = usersGroup.map(user => {
            return user.id;
        });
        listMembers.push(String(this.user.id));
        if (this.group) {
            this.updateGroup(listMembers);
        } else {
            this.addNameGroup(listMembers);
        }
    }

    async addNameGroup(listMembers) {
        console.log('-> listMembers', listMembers);
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
                            const group = {
                                name: alertData.name,
                                members: listMembers,
                                createdAt: new Date(),
                                createdBy: this.user.id,
                                lastDate: new Date()
                            };
                            this.createGroup(group);
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

    private createGroup(group) {
        this.chatService.createGroup(group)
            .then(res => {
                this.getGroupCreated(res.id);
            })
            .catch(e => console.log(e));
    }

    private getGroupCreated(groupId: string) {
        this.chatService.getGroup(groupId)
            .then(res => {
                const group = res.data();
                group.id = res.id;
                this.intentProvider.chatGroupUsers = group;
                this.router.navigate(['tabs/chats', this.user.id])
                    .then(() => this.modalController.dismiss());
            });
    }

    changeSegment($event: CustomEvent) {
        this.typeChat = $event.detail.value;
    }

    private updateGroup(listMembers: string[]) {
        this.group.members = listMembers;
        this.chatService.updateGroup(this.group.id, listMembers)
            .then(() => {
                this.intentProvider.chatGroupUsers = this.group;
                this.router.navigate(['tabs/chats', this.user.id])
                    .then(() => this.modalController.dismiss());
            });
    }
}
