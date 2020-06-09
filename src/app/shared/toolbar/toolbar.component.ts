import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

    @Input() showName = true;
    @Input() transparent = false;
    @Input() username = 'Juan Perez';

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    openChats() {
        this.router.navigateByUrl('tabs/chats');
    }
}
