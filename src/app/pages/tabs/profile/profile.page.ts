import { AfterViewChecked, Component, DoCheck, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IntentProvider } from '../../../providers/intent.provider';
import { StorageService } from '../../../services/storage.service';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit, DoCheck {

    lang: string;
    user: any = {};

    constructor(private translate: TranslateService,
                private alertController: AlertController,
                private router: Router,
                private authService: AuthService,
                private storage: StorageService,
                private intentProvider: IntentProvider) {
    }

    async ngOnInit(){
        this.lang = this.translate.getDefaultLang();
        const user = await this.storage.getDriver();
        this.user = user ? user : {};
        console.log('-> this.lang', this.lang);
    }

    async ngDoCheck() {
        if (this.intentProvider.updateDriver) {
            this.intentProvider.updateDriver = false;
            this.user = await this.storage.getDriver();
        }
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
                this.router.navigateByUrl('/login')
                    .then(() => {
                        window.location.reload();
                    });
            }).catch(async e => {
                console.log(e);
                if (e.status === 401) {
                    await this.storage.setLogged(false);
                    this.router.navigateByUrl('/login');
                }
            });
    }

}
