import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-historic',
    templateUrl: 'historic.page.html',
    styleUrls: ['historic.page.scss']
})
export class HistoricPage {
    private segmentSelected = 'all';

    constructor() {
    }

    changeSegment($event: any) {
        this.segmentSelected = $event.detail.value;
    }

    viewDetails() {
        console.log('-> ver detalles');
    }
}
