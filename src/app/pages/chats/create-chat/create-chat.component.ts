import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseChatService } from '../../../services/firebase-chat.service';

@Component({
    selector: 'app-create-chat',
    templateUrl: './create-chat.component.html',
    styleUrls: ['./create-chat.component.scss'],
})
export class CreateChatComponent implements OnInit {

    users: any[] = [];
    loading = true;

    constructor(private modalController: ModalController,
                private router: Router,
                private chatService: FirebaseChatService) {
    }

    ngOnInit() {
        this.getUsers();
    }

    private getUsers() {
        this.loading = true;
        this.chatService.getAllUsers()
            .subscribe((res: any) => {
                console.log('-> res', res);
                const newUsers = [];
                res.forEach(x => {
                    const user = x.payload.doc.data();
                    user.id = x.payload.doc.id;
                    newUsers.push(user);
                });
                this.users = newUsers;
                this.loading = false;
                console.log('-> this.users', this.users);
            });
    }

    async dismissModal() {
        await this.modalController.dismiss();
    }

    openChat(id) {
        console.log('-> id', id);
        this.router.navigate(['tabs/chats', id])
            .then(() => this.modalController.dismiss());
    }
}
