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

    async auth() {
        const url = this.api.url + 'auth/auth';
        const options: any = await this.api.getHeaders();
        return this.http.post(url, {}, options);
    }

}
