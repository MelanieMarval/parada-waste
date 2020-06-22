import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Environment } from '@ionic-native/google-maps';
// Services
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from './services/notifications.service';
import { PlatformUtils } from './utils/platform.utils';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public activeLang = 'en';

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private translate: TranslateService,
        private notificationsService: NotificationsService
    ) {
        const current = this.translate.getBrowserLang();
        console.log('-> current', current);
        this.translate.setDefaultLang(this.activeLang);
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {


            this.statusBar.styleDefault();
            this.splashScreen.hide();
            if (!PlatformUtils.isTest()) {
                this.notificationsService.initConfig();
            }
        });
    }
}
