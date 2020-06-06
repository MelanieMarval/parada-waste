import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatComponent } from '../chat/chat.component';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }

    async openChat() {
        const modal = await this.modalController.create({
            component: ChatComponent,
            animated: false,
            cssClass: 'modal-fade'
        });
        await modal.present();
    }
}
