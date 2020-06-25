import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { IntentProvider } from '../../providers/intent.provider';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit {

    form: FormGroup;
    submitted = false;
    sending = false;

    constructor(private authService: AuthService,
                private storage: StorageService,
                private router: Router,
                private intentProvider: IntentProvider,
                private toastController: ToastController) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    login() {
        this.submitted = true;
        if (this.form.valid) {
            const user = {
                email: this.form.get('email').value,
                password: this.form.get('password').value
            };
            this.sending = true;
            this.authService.login(user)
                .then(async (res: any) => {
                    console.log('-> res', res);
                    await this.storage.setAccessToken(res.access_token);
                    this.auth(user);
                }).catch(e => this.handleError(e));
        }
    }

    private auth(user) {
        this.authService.getDriver(user)
            .then(async res => {
                console.log('-> res', res);
                this.sending = false;
                this.form.reset();
                await this.storage.setDriver(res);
                await this.router.navigateByUrl('/tabs');
            }).catch(e => this.handleError(e));
    }

    async handleError(error) {
        this.sending = false;
        let message = '';
        if (error.status === 401) {
            message = 'Your email or password are incorrect. Verify!';
        }
        if (error.status === 0) {
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
                    role: 'cancel'
                }
            ]
        });
        await toast.present();
    }


}
