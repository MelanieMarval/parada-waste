import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

    message = '';
    sending = false;

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
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
