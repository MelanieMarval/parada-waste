import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class IntentProvider {

    private _chatReceiverUser: any;
    private _chatGroupUsers: any;
    private _updateDriver: boolean;
    private _updateRoute: boolean;
    private _orderToView: any;


    /* Chats */
    get chatReceiverUser(): any {
        return this._chatReceiverUser;
    }

    set chatReceiverUser(value: any) {
        this._chatReceiverUser = value;
    }

    get chatGroupUsers(): any {
        return this._chatGroupUsers;
    }

    set chatGroupUsers(value: any) {
        this._chatGroupUsers = value;
    }

    /* END chats */

    get updateDriver(): boolean {
        return this._updateDriver;
    }

    set updateDriver(value: boolean) {
        this._updateDriver = value;
    }

    get updateRoute(): boolean {
        return this._updateRoute;
    }

    set updateRoute(value: boolean) {
        this._updateRoute = value;
    }

    get orderToView(): any {
        return this._orderToView;
    }

    set orderToView(value: any) {
        this._orderToView = value;
    }
}
