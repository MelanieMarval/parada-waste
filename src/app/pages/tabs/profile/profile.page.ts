import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {

    lang: string;

    constructor(private translate: TranslateService,
                private alertController: AlertController,
                private router: Router) {
    }

    ngOnInit(): void {
        this.lang = this.translate.getDefaultLang();
        console.log('-> this.lang', this.lang);
    }

    changeLanguage($event: any) {
        this.lang = $event.detail.value;
        this.translate.use(this.lang);
        console.log('-> $event', $event.detail.value);
    }

    async confirmLogout() {
        const text = await this.translate.get('profile.options.logoutMsg').toPromise();
        const cancel = await this.translate.get('button.cancel').toPromise();
        const alert = await this.alertController.create({
            cssClass: '',
            header: text.header,
            buttons: [
                {
                    text: cancel,
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: text.btnYes,
                    handler: () => {
                        this.router.navigateByUrl('/login');
                    }
                }
            ]
        });

        await alert.present();
    }
}
