import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';

import { ToolbarModule } from '../../../shared/toolbar/toolbar.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileEditPage } from './edit/profile-edit.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: ProfilePage}]),
        ToolbarModule,
        TranslateModule,
        ReactiveFormsModule,
    ],
    declarations: [ProfilePage, ProfileEditPage],
})
export class ProfileModule {
}
