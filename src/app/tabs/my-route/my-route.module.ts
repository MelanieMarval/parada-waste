import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MyRoutePage } from './my-route.page';
import { ToolbarModule } from '../../shared/toolbar/toolbar.module';
import { BackgroundEmptyModule } from '../../shared/background-empty/background-empty.module';
import { TranslateModule } from '@ngx-translate/core';
import { FinishRoutePage } from './finish-route/finish-route.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ToolbarModule,
        RouterModule.forChild([{path: '', component: MyRoutePage}]),
        BackgroundEmptyModule,
        TranslateModule
    ],
  declarations: [MyRoutePage, FinishRoutePage]
})
export class MyRouteModule {}
