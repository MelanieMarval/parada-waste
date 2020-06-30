import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarModule } from '../../../shared/toolbar/toolbar.module';
import { BackgroundEmptyModule } from '../../../shared/background-empty/background-empty.module';
import { HistoricPage } from './historic.page';
import { JourneyPage } from './journey/journey.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: HistoricPage}]),
        TranslateModule,
        ToolbarModule,
        BackgroundEmptyModule,
    ],
    declarations: [HistoricPage, JourneyPage]
})
export class HistoricModule {
}
