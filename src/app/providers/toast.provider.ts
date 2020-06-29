import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class ToastProvider {

    constructor(private toastController: ToastController) {
    }

    async handleError(status: number, info?: string) {
        console.log(status);
        let message = '';

        switch (status) {
            case -1:
                message = info;
                break;
            case 0:
                message = 'Check your internet connection';
                break;
            case 403:
                message = 'Your user does not have the right permissions';
                break;
            case 422:
                message = 'We cannot process this request, please try restarting the app.';
                break;
        }

        const toast = await this.toastController.create({
            header: 'Error!',
            message,
            position: 'bottom',
            color: 'dark',
            mode: 'ios',
            buttons: [{
                text: 'Ok',
                role: 'cancel',
            }],
        });
        await toast.present();
    }

    async handleSuccess(message: string, duration = 3000) {
        const toast = await this.toastController.create({
            message,
            position: 'bottom',
            color: 'primary',
            mode: 'ios',
            duration,
        });
        await toast.present();
    }

    async handleSuccessTabs(message: string, duration = 3000) {
        const toast = await this.toastController.create({
            message,
            position: 'bottom',
            color: 'primary',
            cssClass: 'toast-bottom-above-tabs',
            mode: 'ios',
            duration,
        });
        await toast.present();
    }


}
