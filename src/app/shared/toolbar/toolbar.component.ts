import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatComponent } from '../../tabs/chats/chat/chat.component';
import { ChatsComponent } from '../../tabs/chats/chats.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

    constructor(private modalController: ModalController,
                private router: Router) {
    }

    ngOnInit() {
    }

    async openChat() {
        const modal = await this.modalController.create({
            component: ChatsComponent,
            animated: false,
            cssClass: 'modal-fade'
        });
        await modal.present();
    }

    openChats() {
        this.router.navigateByUrl('tabs/chats');
    }
}
