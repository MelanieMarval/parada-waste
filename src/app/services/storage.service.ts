import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const DEVICE_TOKEN = 'device_token';
const ACCESS_TOKEN = 'access_token';
const DRIVER = 'driver';
const LOGGED = 'logged';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

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

}
