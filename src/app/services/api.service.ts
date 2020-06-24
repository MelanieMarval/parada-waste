import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import { StorageService } from './storage.service';
import { PlatformUtils } from '../utils/platform.utils';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    public url = 'https://paradawastebk.tusitioenlared.com/api/v1/';
    public testDeviceToken = 'test-browser-emulator-mobile';

    constructor(private storage: StorageService) { }

    async getHeaders(requestAuth = true) {
        let header = new HttpHeaders();
        let deviceToken = this.testDeviceToken;
        if (!PlatformUtils.isTest()) {
            deviceToken = await this.storage.getDeviceToken();
        }
        header = header.append('device_token', deviceToken);
        if (requestAuth) {
            const accessToken = await this.storage.getAccessToken();
            header = header.append('Authorization', `Bearer ${accessToken}`);
        }
        return { headers: header };
    }
}
