import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class DriverService {

    constructor(private api: ApiService,
                private http: HttpClient) {
    }

    async getMe() {
        const url = `${this.api.url}app/driver/me`;
        const options: any = await this.api.getHeaders();
        return this.http.post(url, {}, options).toPromise();
    }

    async update(driver: any) {
        const url = `${this.api.url}app/driver/me/edit`;
        const options: any = await this.api.getHeaders();
        return this.http.post(url, driver, options).toPromise();
    }
}
