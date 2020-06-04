import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TravelPage } from './travel.page';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarModule } from '../../shared/toolbar/toolbar.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: TravelPage}]),
        TranslateModule,
        ToolbarModule
    ],
    declarations: [TravelPage]
})
export class TravelModule {
}
