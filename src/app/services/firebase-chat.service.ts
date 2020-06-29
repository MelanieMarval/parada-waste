import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { equals } from '@ngx-translate/core/lib/util';
import { Message } from './interfaces/message';
import { firestore } from 'firebase';
import { last } from 'rxjs/operators';

const COLLECTION_USERS = 'users';
const COLLECTION_CHATS = 'chats';
const COLLECTION_GROUPS = 'groups';
const COLLECTION_MESSAGES = 'messages';

@Injectable({
    providedIn: 'root',
})
export class FirebaseChatService {

    constructor(private angularFirestore: AngularFirestore) {
    }

    public getAllUsers() {
        return this.angularFirestore.collection(COLLECTION_USERS).get().toPromise();
    }

    public getMyChats(userId: string) {
        return this.angularFirestore.collection(COLLECTION_USERS).doc(userId)
            .collection(COLLECTION_CHATS).snapshotChanges();
    }

    public getMessagesByChat(userId: string, receiverId: string) {
        return this.angularFirestore.collection(COLLECTION_USERS).doc(userId)
            .collection(COLLECTION_CHATS).doc(receiverId)
            .collection(COLLECTION_MESSAGES).snapshotChanges();
    }

    public sendMessage(sender: any, receiver: any, message: Message) {
        return new Promise(async resolve => {
            // create chat
            await this.angularFirestore.collection(COLLECTION_USERS).doc(receiver.id)
                .collection(COLLECTION_CHATS).doc(String(sender.id))
                .set({name: sender.name, lastDate: message.date, lastMessage: message.message, unread: true});
            await this.angularFirestore.collection(COLLECTION_USERS).doc(String(sender.id))
                .collection(COLLECTION_CHATS).doc(receiver.id)
                .set({name: receiver.name, lastDate: message.date, lastMessage: message.message});
            // add message
            await this.angularFirestore.collection(COLLECTION_USERS).doc(receiver.id)
                .collection(COLLECTION_CHATS).doc(String(sender.id))
                .collection(COLLECTION_MESSAGES).add(message);
            await this.angularFirestore.collection(COLLECTION_USERS).doc(String(sender.id))
                .collection(COLLECTION_CHATS).doc(receiver.id)
                .collection(COLLECTION_MESSAGES).add(message);
            resolve();
        });
    }

    public createGroup(group: any) {
        return this.angularFirestore.collection(COLLECTION_GROUPS).add(group);
    }

    public getGroup(groupId: string) {
        return this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId).get().toPromise();
    }

    public getMessagesByGroup(groupId: string) {
        return this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId)
            .collection(COLLECTION_MESSAGES).snapshotChanges();
    }

    public getMyGroups(userId: string) {
        return this.angularFirestore.collection(COLLECTION_GROUPS, ref => ref.where('members', 'array-contains', userId))
            .snapshotChanges();
    }

    public sendMessageGroup(groupId: string, message: Message, unread) {
        return new Promise(async resolve => {
            await this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId)
                .update({lastDate: message.date, lastMessage: message.message, unread});
            await this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId)
                .collection(COLLECTION_MESSAGES).add(message);
            resolve();
        });
    }

    public updateGroup(groupId: string, members) {
        return this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId)
            .update({members});
    }

    // public sendMessageGroup(sender: any, group: any, message: any) {
    //     return new Promise(async resolve => {
    //         await this.angularFirestore.collection(COLLECTION_GROUPS).doc(group.id ? group.id : undefined).set({
    //             name: group.name,
    //             members: group.members,
    //             createdAt: group.createdAt,
    //             createdBy: group.createdBy,
    //             lastDate: message.date,
    //             lastMessage: message.message
    //         });
    //         await this.angularFirestore.collection(COLLECTION_GROUPS).doc(group.id ? group.id : undefined)
    //             .collection(COLLECTION_MESSAGES).doc().set(message);
    //         resolve();
    //     });
    // }

    public async putChatReadGroup(groupId: string, userId: string) {
        const group = await this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId).get().toPromise();
        const unread = group.data().unread;
        unread[userId] = false;

        return this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId)
            .update({unread});
    }

    public putChatRead(senderId: string, receiverId): Promise<any> {
        return this.angularFirestore.collection(COLLECTION_USERS).doc(senderId)
            .collection(COLLECTION_CHATS).doc(receiverId)
            .update({unread: false});
    }

}
