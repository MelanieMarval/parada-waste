import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    messages: any[] = [
        {
            title: 'Titulo de la push',
            body: 'Cuerpo de la notificacion',
            date: new Date()
        }
    ];

    constructor(private oneSignal: OneSignal) {

    }

    initConfig() {
        // appId viene de oneSignal y googleProjectNumber de Firebase
        this.oneSignal.startInit('795972b0-7450-410d-89e7-3fc4bbce8a21', '355087430570');

        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

        this.oneSignal.handleNotificationReceived().subscribe((push) => {
            // do something when notification is received
            console.log('-> notificacion recibida', push);
        });

        this.oneSignal.handleNotificationOpened().subscribe((push) => {
            // do something when a notification is opened
            console.log('-> notificacion abierta', push);
        });

        this.oneSignal.getIds().then(data => {
            console.log(data);
        });
        this.oneSignal.endInit();
    }

}
