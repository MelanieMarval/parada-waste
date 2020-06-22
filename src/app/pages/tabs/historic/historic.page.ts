import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseChatService } from '../../../services/firebase-chat.service';
import { DocumentChangeType } from '@angular/fire/firestore';

@Component({
    selector: 'app-historic',
    templateUrl: 'historic.page.html',
    styleUrls: ['historic.page.scss']
})
export class HistoricPage implements OnInit {

    private segmentSelected = 'all';
    users: any[] = [];
    name: string;

    constructor(private firebaseSevice: FirebaseChatService) {
    }

    ngOnInit(): void {
        this.firebaseSevice.getAllUsers()
            .subscribe((res: any) => {
                console.log('-> res', res);
                const newUsers = [];
                res.forEach(x => {
                    newUsers.push(x.payload.doc.data());
                });
                this.users = newUsers;
                console.log('-> this.users', this.users);
            });
    }

    changeSegment($event: any) {
        this.segmentSelected = $event.detail.value;
    }

    viewDetails() {
        console.log('-> ver detalles');
    }

    processForm(event: any) {
        console.log('-> event', event);
        this.firebaseSevice.create({name: this.name})
            .then((res) => {
                console.log('Usuario creado!');
                console.log('-> res', res);
                // this.users.push();
            }, (error) => {
                console.error(error);
            });


    }

}
