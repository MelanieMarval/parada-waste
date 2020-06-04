import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MyRoutePage } from './my-route.page';
import { ToolbarModule } from '../../shared/toolbar/toolbar.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ToolbarModule,
        RouterModule.forChild([{path: '', component: MyRoutePage}])
    ],
  declarations: [MyRoutePage]
})
export class MyRouteModule {}
