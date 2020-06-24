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

    async login(credentials: any) {
        const url = `${this.api.url}auth/login`;
        const options: any = await this.api.getHeaders(false);
        return this.http.post(url, credentials, options).toPromise();
    }

    async getDriver(credentials: any) {
        const url = `${this.api.url}auth/me`;
        const options: any = await this.api.getHeaders();
        return this.http.post(url, credentials, options).toPromise();
    }

    async logout() {
        const url = `${this.api.url}auth/logout`;
        const options: any = await this.api.getHeaders();
        return this.http.post(url, {}, options).toPromise();
    }

}
