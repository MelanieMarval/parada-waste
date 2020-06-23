import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    public url = 'https://paradawastebk.tusitioenlared.com/api/v1/';
    public deviceToken = 'd41d8cd98f00b204e9800998ecf8427e';
    public accessToken = '';

    constructor() {
    }

    getHeaderLogin() {
        let header = new HttpHeaders();
        header = header.append('content-type', 'application/json; charset=utf-8');
        header = header.append('device_token', this.deviceToken);
        return header;
    }

    getHeaders(): HttpHeaders {
        let header = new HttpHeaders();
        header = header.append('content-type', 'application/json; charset=utf-8');
        header = header.append('device_token', this.deviceToken);
        header = header.append('Authorization', `Bearer ${this.accessToken}`);
        return header;
    }

}
