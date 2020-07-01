import { EventEmitter, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Order } from './interfaces/order';

const DEVICE_TOKEN = 'device_token';
const ACCESS_TOKEN = 'access_token';
const DRIVER = 'driver';
const ORDER_ON_ROUTE = 'order_on_route';
const LOGGED = 'logged';

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    private currentOrderEmitter = new EventEmitter<Order>();

    constructor(private storage: Storage) {
    }

    async setDeviceToken(value: string) {
        await this.storage.set(DEVICE_TOKEN, value);
    }

    async setAccessToken(value: string) {
        await this.storage.set(ACCESS_TOKEN, value);
        await this.setLogged(true);
    }

    async getDeviceToken(): Promise<string> {
        return await this.storage.get(DEVICE_TOKEN);
    }

    async getAccessToken(): Promise<string> {
        return await this.storage.get(ACCESS_TOKEN);
    }

    async setDriver(driver: any) {
        await this.storage.set(DRIVER, driver);
    }

    async getDriver(): Promise<any> {
        return await this.storage.get(DRIVER);
    }

    async setLogged(logged: boolean) {
        await this.storage.set(LOGGED, logged);
    }

    async isLogged(): Promise<boolean> {
        const isLogged = await this.storage.get(LOGGED);
        return !!isLogged;
    }

    async setOrderOnRoute(order: any): Promise<any> {
        let orderToSave;
        if (order) {
            orderToSave = JSON.stringify(order);
        }
        await this.storage.set(ORDER_ON_ROUTE, orderToSave);
        await this.emitterOnRoute();
    }

    async getOrderOnRoute(): Promise<Order> {
        let order;
        try {
            const orderString = await this.storage.get(ORDER_ON_ROUTE);
            if (orderString) {
                order = JSON.parse(orderString);
            }
        } catch (e) {
            order = undefined;
        }
        return order;
    }

    getOrderOnRouteEmitter(): EventEmitter<Order> {
        this.emitterOnRoute();
        return this.currentOrderEmitter;
    }

    private async emitterOnRoute(): Promise<any> {
        this.currentOrderEmitter.emit(await this.getOrderOnRoute());
    }

}
