import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseChatService } from '../../../services/firebase-chat.service';
import { IntentProvider } from '../../../providers/intent.provider';
import { StorageService } from '../../../services/storage.service';

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

    constructor(private modalController: ModalController,
                private router: Router,
                private chatService: FirebaseChatService,
                private storage: StorageService,
                private intentProvider: IntentProvider) {
    }

    async ngOnInit() {
        this.user = await this.storage.getDriver();
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

    openChat(receiver) {
        this.intentProvider.chatReceiverUser = {id: receiver.id, name: receiver.name};
        this.router.navigate(['tabs/chats', receiver.id])
            .then(() => this.modalController.dismiss());
    }
}
