import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from '../../services/storage.service';
import { OrderService } from '../../services/order.service';
import { ToastProvider } from '../../providers/toast.provider';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

    constructor(private statusBar: StatusBar,
                private storage: StorageService,
                private orderService: OrderService,
                private toastController: ToastController) {
    }

    ngOnInit() {
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByHexString('#002650');
        this.getOrderOnRoute();
    }

    async getOrderOnRoute() {
        // const orderOnRoute = await this.storage.getOrderOnRoute();
        // if (!orderOnRoute) {
            this.orderService.getOrderOnRoute()
                .then(async (res: any) => {
                    if (res.status) {
                        await this.storage.setOrderOnRoute(res.order);
                    } else {
                        await this.storage.setOrderOnRoute(undefined);
                    }
                })
                .catch(async error => {
                    const toast = await this.toastController.create({
                        header: 'Error!',
                        message: 'You have no internet',
                        position: 'bottom', color: 'dark', mode: 'ios',
                        buttons: [{
                            text: 'Try again', role: 'try',
                            handler: () => {
                                this.getOrderOnRoute();
                            }
                        }],
                    });
                    await toast.present();
                });
        // }
    }

}
