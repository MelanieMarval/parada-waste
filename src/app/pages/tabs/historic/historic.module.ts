import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HistoricPage } from './historic.page';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarModule } from '../../../shared/toolbar/toolbar.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: HistoricPage}]),
        TranslateModule,
        ToolbarModule
    ],
    declarations: [HistoricPage]
})
export class HistoricModule {
}