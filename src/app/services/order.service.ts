import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private api: ApiService,
                private http: HttpClient) {
    }

    async getOrders() {
        const url = `${this.api.url}app/driver`;
        const options: any = await this.api.getHeaders();
        return this.http.get(url, options).toPromise();
    }
}
