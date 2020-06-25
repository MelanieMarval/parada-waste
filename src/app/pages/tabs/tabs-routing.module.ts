import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { ProfileEditPage } from './profile/edit/profile-edit.page';

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'historic',
                loadChildren: () => import('./historic/historic.module').then(m => m.HistoricModule)
            },
            {
                path: 'my-route',
                loadChildren: () => import('./my-route/my-route.module').then(m => m.MyRouteModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
            },
            {
                path: '',
                redirectTo: '/tabs/historic',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/historic',
        pathMatch: 'full'
    },
    {
        path: 'historic/journey/:code',
        loadChildren: () => import('./historic/journey/journey.module').then(m => m.JourneyModule)
    },
    {
        path: 'profile/edit', component: ProfileEditPage
    },
    {
        path: 'chats',
        loadChildren: () => import('../chats/chats.module').then(m => m.ChatsModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
