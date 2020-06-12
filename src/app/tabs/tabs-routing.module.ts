import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

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
        loadChildren: () => import('./journey/journey.module').then(m => m.JourneyModule)
    },
    {
        path: 'chats',
        loadChildren: () => import('./chats/chats.module').then(m => m.ChatsModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
