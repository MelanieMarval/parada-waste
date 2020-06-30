import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
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

    async getOrderOnRoute() {
        const url = `${this.api.url}app/driver/current-order`;
        const options: any = await this.api.getHeaders();
        return this.http.get(url, options).toPromise();
    }

    async getOrderById(id: number) {
        const url = `${this.api.url}app/driver/order/${id}`;
        const options: any = await this.api.getHeaders();
        return this.http.post(url, {}, options).toPromise();
    }

    async startTrip(id: number, params: any) {
        const url = `${this.api.url}app/driver/startTrip/${id}`;
        const options: any = await this.api.getHeaders();
        return this.http.post(url, params, options).toPromise();
    }
}
