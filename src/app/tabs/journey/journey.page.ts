import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-journey',
    templateUrl: 'journey.page.html',
    styleUrls: ['journey.page.scss']
})
export class JourneyPage implements OnInit {

    travelCode: string;
    travel: any = {};

    constructor(private route: ActivatedRoute,
                private router: Router,
                private alertController: AlertController,
                private translate: TranslateService) {
        this.travelCode = route.snapshot.params.code;
    }

    ngOnInit(): void {
        // get Travel by code and use interface with data
        this.travel = {
            id: 545454,
            code: this.travelCode,
            positionBegin: 'SEDE Venezuela',
            positionEnd: 'calle 156 c/c 189 Urb. Alianza, El Mirador, Bolivar',
            status: 'PENDING', // PENDING, PROCESS, DONE, CANCEL
            mileage: 15000,
            processedAt: null,
            doneAt: null,
            cancelAt: null
        };
    }


    async enterMileage() {
        const text = await this.translate.get('journey.prompt').toPromise();
        const alert = await this.alertController.create({
            cssClass: 'prompt-primary',
            header: text.title,
            inputs: [{
                name: 'mileage',
                type: 'number',
                value: 0
            }],
            buttons: [
                {
                    text: text.buttonCancel,
                    role: 'cancel',
                    cssClass: 'light',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: text.buttonAccept,
                    cssClass: 'light',
                    handler: (alertData) => {
                        console.log(alertData);
                        if (alertData.mileage > 0) {
                            this.router.navigateByUrl('/tabs/my-route');
                        }
                    }
                }
            ]
        });
        await alert.present();

    }


}
