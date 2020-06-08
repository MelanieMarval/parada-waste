import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
import { ChatsComponent } from './chats.component';
import { RouterModule } from '@angular/router';
import { HistoricPage } from '../historic/historic.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([{ path: '', component: ChatsComponent }, { path: ':id', component: ChatComponent}])
    ],
    declarations: [ChatComponent, ChatsComponent],
    exports: [ChatComponent, ChatsComponent]
})
export class ChatsModule {
}
