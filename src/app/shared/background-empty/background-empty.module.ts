import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BackgroundEmptyComponent } from './background-empty.component';

@NgModule({
    declarations: [BackgroundEmptyComponent],
    imports: [IonicModule, RouterModule, CommonModule],
    exports: [BackgroundEmptyComponent]
})
export class BackgroundEmptyModule {
}
