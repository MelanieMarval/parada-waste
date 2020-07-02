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

    // CHATS PERSONAL

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
                .set({name: receiver.name, lastDate: message.date, lastMessage: message.message, unread: false});
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

    public putChatRead(senderId: string, receiverId: string): Promise<any> {
        return this.angularFirestore.collection(COLLECTION_USERS).doc(senderId)
            .collection(COLLECTION_CHATS).doc(receiverId)
            .update({unread: false});
    }

    deleteChatMessages(senderId: string, receiverId: string) {
        return new Promise((resolve, reject) => {
            this.angularFirestore
                .collection(COLLECTION_USERS).doc(senderId)
                .collection(COLLECTION_CHATS).doc(receiverId)
                .collection(COLLECTION_MESSAGES)
                .get().toPromise()
                .then(async (res: firestore.QuerySnapshot<firestore.DocumentData>) => {
                    const batch = this.angularFirestore.firestore.batch();
                    res.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    await batch.commit();
                    await this.angularFirestore
                        .collection(COLLECTION_USERS).doc(senderId)
                        .collection(COLLECTION_CHATS).doc(receiverId).delete();
                    resolve();
                }).catch(_ => reject());
        });
    }


    // CHATS GROUP

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
        return new Promise(async (resolve, reject) => {
            try {
                await this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId)
                    .update({lastDate: message.date, lastMessage: message.message, unread});
                await this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId)
                    .collection(COLLECTION_MESSAGES).add(message);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    public updateGroup(groupId: string, members: string[]) {
        return this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId)
            .update({members});
    }

    public async putChatReadGroup(groupId: string, userId: string) {
        const group = await this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId)
            .get().toPromise();
        const unread = group.data().unread;
        unread[userId] = false;

        return this.angularFirestore.collection(COLLECTION_GROUPS).doc(groupId)
            .update({unread});
    }

    deleteGroupMessages(groupId: string) {
        return new Promise((resolve, reject) => {
            this.angularFirestore
                .collection(COLLECTION_GROUPS).doc(groupId)
                .collection(COLLECTION_MESSAGES)
                .get().toPromise()
                .then(async (res: firestore.QuerySnapshot<firestore.DocumentData>) => {
                    const batch = this.angularFirestore.firestore.batch();
                    res.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    await batch.commit();
                    await this.angularFirestore
                        .collection(COLLECTION_GROUPS).doc(groupId)
                        .delete();
                    resolve();
                }).catch(_ => reject());
        });
    }


}
