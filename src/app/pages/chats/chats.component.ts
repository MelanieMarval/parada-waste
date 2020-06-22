import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chat',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {

    constructor(private modalController: ModalController,
                private router: Router) {
    }

    ngOnInit() {
    }

    openChat(id) {
        this.router.navigate(['tabs/chats', id]);
    }

    closeChat() {
        this.modalController.dismiss();
    }
}
