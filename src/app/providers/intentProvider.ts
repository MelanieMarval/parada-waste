import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class IntentProvider {

    private _userParadaWaste: any;
    private _chatReceiverUser: any;
    private _orderToView: any;


    get userParadaWaste(): any {
        return this._userParadaWaste;
    }

    set userParadaWaste(value: any) {
        this._userParadaWaste = value;
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
