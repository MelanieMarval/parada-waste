import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-background-empty',
    templateUrl: './background-empty.component.html',
    styleUrls: ['./background-empty.component.scss'],
})
export class BackgroundEmptyComponent implements OnInit {

    @Input() title = '';
    @Input() text = '';
    @Input() height = 100;
    @Input() src ?= 'assets/img/no-route.png';

    constructor() {
    }

    async ngOnInit() {
    }

}
