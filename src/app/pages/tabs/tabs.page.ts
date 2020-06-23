import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

    constructor(private statusBar: StatusBar) {
    }

    ngOnInit() {
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByHexString('#002650');
    }

}
