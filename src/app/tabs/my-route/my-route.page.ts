import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FinishRoutePage } from './finish-route/finish-route.page';

@Component({
    selector: 'app-my-route',
    templateUrl: 'my-route.page.html',
    styleUrls: ['my-route.page.scss']
})
export class MyRoutePage implements OnInit {

    hasTravel = true;
    travel: any = {};
    isNear = true;

    constructor(private alertController: AlertController,
                private modalController: ModalController) {
    }

    ngOnInit(): void {
        // get Travel by code and use interface with data
        this.travel = {
            id: 545454,
            code: 8552,
            positionBegin: 'SEDE Venezuela',
            positionEnd: 'calle 156 c/c 189 Urb. Alianza, El Mirador, Bolivar',
            status: 'PENDING', // PENDING, PROCESS, DONE, CANCEL
            mileage: 15000,
            processedAt: new Date(),
            doneAt: null,
            cancelAt: null
        };
    }

    async confirmCancel() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alerta!',
            message: 'Esta seguro de que desea cancelar este viaje?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Si, cancelar',
                    handler: () => {
                        this.travel.cancelAt = new Date();
                        this.travel.status = 'CANCEL';
                        this.hasTravel = false;
                    }
                }
            ]
        });

        await alert.present();
    }

    pushNotification() {
        this.isNear = false;
    }

    async doneJourney() {
        const modal: HTMLIonModalElement =
            await this.modalController.create({
                component: FinishRoutePage,
                componentProps: {
                    aParameter: true,
                    otherParameter: new Date()
                }
            });

        modal.onDidDismiss().then((detail: any) => {
            console.log('-> detail', detail);
            if (detail.data) {
                this.hasTravel = false;
            }
        });

        await modal.present();
    }
}
