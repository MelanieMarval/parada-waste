import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JourneyPage } from './journey.page';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarModule } from '../../../../shared/toolbar/toolbar.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: JourneyPage}]),
        TranslateModule,
        ToolbarModule
    ],
    declarations: [JourneyPage]
})
export class JourneyModule {
}
