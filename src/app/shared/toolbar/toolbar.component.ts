import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IntentProvider } from '../../providers/intentProvider';
import { StorageService } from '../../services/storage.service';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

    @Input() showName = true;
    @Input() transparent = false;
    @Input() username = '';

    constructor(private router: Router,
                private storage: StorageService) {
    }

    async ngOnInit() {
        const driver = await this.storage.getDriver();
        this.username = driver.name;
    }

    openChats() {
        this.router.navigateByUrl('tabs/chats');
    }
}
