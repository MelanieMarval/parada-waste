import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

    message = '';

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }

    async closeChat() {
        await this.modalController.dismiss();
    }

    sendMessage() {
        console.log(this.message);
    }
}
