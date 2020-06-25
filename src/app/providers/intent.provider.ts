import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class IntentProvider {

    private _updateDriver: boolean;
    private _chatReceiverUser: any;
    private _orderToView: any;


    get updateDriver(): boolean {
        return this._updateDriver;
    }

    set updateDriver(value: boolean) {
        this._updateDriver = value;
    }

    get chatReceiverUser(): any {
        return this._chatReceiverUser;
    }

    set chatReceiverUser(value: any) {
        this._chatReceiverUser = value;
    }

    get orderToView(): any {
        return this._orderToView;
    }

    set orderToView(value: any) {
        this._orderToView = value;
    }
}
