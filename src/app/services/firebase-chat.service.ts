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

    public sendMessage(senderId: string, receiverId: string, message: string) {
        return this.angularFirestore.collection(COLLECTION_USERS).doc(senderId).collection(COLLECTION_CHATS).doc(receiverId).collection(COLLECTION_MESSAGES).add({message});
    }

    public getAllChatMessages(userId: string, receiverId: string) {
        return this.angularFirestore.collection(COLLECTION_USERS).doc(userId).collection(COLLECTION_CHATS).doc(receiverId).collection(COLLECTION_MESSAGES).snapshotChanges();
    }

}
