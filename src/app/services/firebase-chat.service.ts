import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { equals } from '@ngx-translate/core/lib/util';
import { Message } from './interfaces/message';
import { firestore } from 'firebase';

const COLLECTION_USERS = 'users';
const COLLECTION_CHATS = 'chats';
const COLLECTION_MESSAGES = 'messages';

@Injectable({
    providedIn: 'root'
})
export class FirebaseChatService {

    constructor(private angularFirestore: AngularFirestore) {
    }

    public create(data) {
        return this.angularFirestore.collection(COLLECTION_USERS).add(data);
    }

    public getAllUsers() {
        return this.angularFirestore.collection(COLLECTION_USERS).snapshotChanges();
    }

    public getAllMyChats(userId: string) {
        return this.angularFirestore.collection(COLLECTION_USERS).doc(userId).collection(COLLECTION_CHATS).snapshotChanges();
    }

    public getAllChatMessages(userId: string, receiverId: string) {
        return this.angularFirestore.collection(COLLECTION_USERS).doc(userId).collection(COLLECTION_CHATS).doc(receiverId).collection(COLLECTION_MESSAGES).snapshotChanges();
    }

    public sendMessage(sender: any, receiver: any, message: any) {
        return new Promise(async resolve => {
            // create chat
            await this.angularFirestore.collection(COLLECTION_USERS).doc(receiver.id).collection(COLLECTION_CHATS).doc(sender.id).set({name: sender.name, lastDate: message.date, lastMessage: message.message, unread: true});
            await this.angularFirestore.collection(COLLECTION_USERS).doc(sender.id).collection(COLLECTION_CHATS).doc(receiver.id).set({name: receiver.name, lastDate: message.date, lastMessage: message.message});
            // add message
            await this.angularFirestore.collection(COLLECTION_USERS).doc(receiver.id).collection(COLLECTION_CHATS).doc(sender.id).collection(COLLECTION_MESSAGES).add(message);
            await this.angularFirestore.collection(COLLECTION_USERS).doc(sender.id).collection(COLLECTION_CHATS).doc(receiver.id).collection(COLLECTION_MESSAGES).add(message);
            resolve();
        });
    }

    public putChatRead(senderId: string, receiverId): Promise<any> {
        // return new Promise((resolve, reject) => {
        //      this.angularFirestore
        //         .collection(COLLECTION_USERS).doc(senderId)
        //         .collection(COLLECTION_CHATS).doc(receiverId)
        //         .collection(COLLECTION_MESSAGES, ref => ref.where('unread', '==', true))
        //         .get().toPromise()
        //         .then(async (res: firestore.QuerySnapshot<firestore.DocumentData>) => {
        //             const batch = this.angularFirestore.firestore.batch();
        //             res.forEach(doc => {
        //                 batch.update(doc.ref, { unread: false });
        //             });
        //             await batch.commit();
        //             await this.angularFirestore
        //                 .collection(COLLECTION_USERS).doc(senderId)
        //                 .collection(COLLECTION_CHATS).doc(receiverId).set({ unread: false });
        //             resolve();
        //         }).catch(_ => reject());
        // });
        return this.angularFirestore.collection(COLLECTION_USERS).doc(senderId).collection(COLLECTION_CHATS).doc(receiverId).update({ unread: false });
    }

}
