import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../../../../services/storage.service';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile-edit.page.html',
    styleUrls: ['profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

    lang: string;
    user: any = {};
    form: FormGroup;

    constructor(private translate: TranslateService,
                private alertController: AlertController,
                private router: Router,
                private storage: StorageService) {
    }

    async ngOnInit() {
        this.user = await this.storage.getDriver();
    }

    validate() {

    }
}
