import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IntentProvider } from '../../../providers/intentProvider';
import { StorageService } from '../../../services/storage.service';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {

    lang: string;
    user: any = {};

    constructor(private translate: TranslateService,
                private alertController: AlertController,
                private router: Router,
                private authService: AuthService,
                private storage: StorageService) {
    }

    async ngOnInit(){
        this.lang = this.translate.getDefaultLang();
        this.user = await this.storage.getDriver();
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
                        this.logout();
                    }
                }
            ]
        });

        await alert.present();
    }

    private logout() {
        this.authService.logout()
            .then(async res => {
                await this.storage.setLogged(false);
                this.router.navigateByUrl('/login');
            }).catch(e => console.log(e));
    }
}
