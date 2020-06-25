import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class ToastProvider {

    constructor(private toastController: ToastController) {
    }

    async handleError(status) {
        console.log(status);
        let message = '';
        if (status === 0) {
            message = 'Check your internet connection';
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
