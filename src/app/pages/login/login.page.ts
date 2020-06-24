import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth-service.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit {

    form: FormGroup;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    login() {
        if (this.form.valid) {
            const user = {
                email: this.form.get('email').value,
                password: this.form.get('password').value
            };
            this.authService.login(user)
                .then((res: any) => {
                    console.log('-> res', res);
                    this.auth(res.access_token, user);
                }).catch(_ => console.log('error'));
        } else {

        }
    }

    private auth(accessToken, user) {
        this.authService.auth(user, accessToken)
            .then(res => {
                console.log('-> res', res);
            }).catch(_ => console.log('error'));
    }

}
