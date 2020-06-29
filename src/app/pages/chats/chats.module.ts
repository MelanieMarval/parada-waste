import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
import { ChatsComponent } from './chats.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CreateChatComponent } from './create-chat/create-chat.component';
import { PipesModule } from '../../pipes/pipes.module';
import { BackgroundEmptyModule } from '../../shared/background-empty/background-empty.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([{path: '', component: ChatsComponent}, {path: ':id', component: ChatComponent}]),
        TranslateModule,
        PipesModule,
        BackgroundEmptyModule,
    ],
    declarations: [ChatComponent, ChatsComponent, CreateChatComponent],
    exports: [ChatComponent, ChatsComponent, CreateChatComponent]
})
export class ChatsModule {
}
