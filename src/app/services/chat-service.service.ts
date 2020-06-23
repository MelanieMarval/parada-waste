import { Injectable } from '@angular/core';
import { FirebaseChatService } from './firebase-chat.service';
import { Message } from './interfaces/message';

@Injectable({
    providedIn: 'root'
})
export class ChatServiceService {

    constructor(private fireChatService: FirebaseChatService) {
    }

    putChatRead(senderId: string, receiverId: string) {
        this.fireChatService.putChatRead(senderId, receiverId)
            .then(res => {
                const messages: Message[] = [];
                res.forEach((x: any) => {
                    const sms = x.payload.doc.data();
                    messages.push(sms);
                });
                console.log('-> messages', messages);
                console.log('-> res', res);
            });
    }

}
