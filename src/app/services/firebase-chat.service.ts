import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

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
        // set name
        this.angularFirestore.collection(COLLECTION_USERS).doc(receiver.id).collection(COLLECTION_CHATS).doc(sender.id).set({name: sender.name, lastDate: message.date, lastMessage: message.message});
        this.angularFirestore.collection(COLLECTION_USERS).doc(sender.id).collection(COLLECTION_CHATS).doc(receiver.id).set({name: receiver.name, lastDate: message.date, lastMessage: message.message});
        // add message
        this.angularFirestore.collection(COLLECTION_USERS).doc(receiver.id).collection(COLLECTION_CHATS).doc(sender.id).collection(COLLECTION_MESSAGES).add({message});
        return this.angularFirestore.collection(COLLECTION_USERS).doc(sender.id).collection(COLLECTION_CHATS).doc(receiver.id).collection(COLLECTION_MESSAGES).add({message});
    }


}
