import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../../services/storage.service';
import { DriverService } from '../../../../services/driver.service';
import { ToastProvider } from '../../../../providers/toast.provider';
import { IntentProvider } from '../../../../providers/intent.provider';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile-edit.page.html',
    styleUrls: ['profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

    saving = false;
    user: any;
    form: FormGroup;
    photo: File | Blob;

    constructor(private translate: TranslateService,
                private router: Router,
                private storage: StorageService,
                private service: DriverService,
                private toast: ToastProvider,
                private intentProvider: IntentProvider) {
    }

    async ngOnInit() {
        this.user = await this.storage.getDriver();
        this.setForm();
    }

    setForm() {
        this.form = new FormGroup({
            name: new FormControl(this.user.name, Validators.required),
            email: new FormControl(this.user.email, [Validators.required,
                Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$')]),
            phone: new FormControl(this.user.phone, Validators.required),
        });
    }

    validate() {
        if (this.form.invalid) {
            return;
        } else {
            this.user.name = this.form.get('name').value;
            this.user.email = this.form.get('email').value;
            this.user.phone = this.form.get('phone').value;
            this.saving = true;
            this.service.update(this.user)
                .then(async res => {
                    await this.storage.setDriver(res);
                    this.intentProvider.updateDriver = true;
                    this.toast.handleSuccessTabs('Your profile has been successfully updated');
                    this.saving = false;
                    this.router.navigate(['/tabs/profile']);
                }).catch(e => {
                    this.saving = false;
                    this.toast.handleError(e.status);
                });
        }
    }

}
