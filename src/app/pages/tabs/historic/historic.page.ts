import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { IntentProvider } from '../../../providers/intent.provider';
import { ToastProvider } from '../../../providers/toast.provider';

@Component({
    selector: 'app-historic',
    templateUrl: 'historic.page.html',
    styleUrls: ['historic.page.scss'],
})
export class HistoricPage implements OnInit {

    segmentSelected = 'all';
    orders: any[] = [];

    constructor(private orderService: OrderService,
                private router: Router,
                private toast: ToastProvider,
                private intentProvider: IntentProvider) {
    }

    ngOnInit(): void {
        this.getOrders();
    }

    getOrders() {
        this.orderService.getOrders()
            .then((res: any) => {
                console.log('-> res', res);
                this.orders = res;
            })
            .catch(e => this.toast.handleError(e.status));
    }

    changeSegment($event: any) {
        this.segmentSelected = $event.detail.value;
    }

    viewDetails(order: any) {
        console.log('-> ver detalles', order);
        this.intentProvider.orderToView = order;
        this.router.navigate(['tabs', 'historic', 'journey', order.id]);
    }


    filterOrders(status: string) {
        return this.orders.filter(order => {
            if (order.status === status) {
                return order;
            }
        });
    }
}
