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
                path: 'tab2',
                loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2PageModule)
            },
            {
                path: 'tab3',
                loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule)
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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
