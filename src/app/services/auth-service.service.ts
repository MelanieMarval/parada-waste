import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private api: ApiService,
                private http: HttpClient) {
    }

    login(credentials: any) {
        const url = this.api.url + 'auth/login';
        const options: any = this.api.getHeaderLogin();
        return this.http.post(url, credentials, options).toPromise();
    }

    async auth( credentials: any, accessToken?: string) {
        if (accessToken) {
            this.api.accessToken = accessToken;
        }
        const url = this.api.url + 'auth/me';
        const options: any = await this.api.getHeaders();
        console.log('-> options', options);
        return this.http.post(url, credentials, options).toPromise();
    }

}
