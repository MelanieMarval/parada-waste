import { AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { FinishRoutePage } from './finish-route/finish-route.page';
import {
    Environment,
    GoogleMap,
    GoogleMapOptions,
    GoogleMaps,
    Marker,
    ILatLng,
} from '@ionic-native/google-maps';
import { StorageService } from '../../../services/storage.service';
import { OrderService } from '../../../services/order.service';
import { ToastProvider } from '../../../providers/toast.provider';
import { Order } from '../../../services/interfaces/order';
import { Router } from '@angular/router';
import { IntentProvider } from '../../../providers/intent.provider';

const removeDefaultMarkers = [
    {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [
            {visibility: 'off'},
        ],
    },
];

@Component({
    selector: 'app-my-route',
    templateUrl: 'my-route.page.html',
    styleUrls: ['my-route.page.scss'],
})
export class MyRoutePage implements OnInit {

    loading: boolean;
    hasTravel = false;
    trip: Order;
    map: GoogleMap;
    collapse = true;

    constructor(private alertController: AlertController,
                private platform: Platform,
                private modalController: ModalController,
                private toast: ToastProvider,
                private orderService: OrderService,
                private router: Router,
                private intentProvider: IntentProvider,
                private storage: StorageService) {
    }

    ngOnInit() {
        this.getOrderByStorage();
    }

    getOrderByStorage() {
        this.loading = true;
        this.storage.getOrderOnRouteEmitter()
            .subscribe(order => {
                console.log('-> order', order);
                if (order) {
                    this.trip = order;
                    this.hasTravel = true;
                    if (this.platform.is('cordova')) {
                        this.loadMap();
                    }
                } else {
                    this.hasTravel = false;
                }
                this.loading = false;
            });
    }

    loadMap() {
        Environment.setEnv({
            API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyD3t5VAdEBMdICcY9FyVcgBHlkeu72OI4s',
            API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyD3t5VAdEBMdICcY9FyVcgBHlkeu72OI4s',
        });

        const locBegin: ILatLng = {lat: this.trip.location_begin.lat, lng: this.trip.location_begin.lon};
        const locEnd: ILatLng = {lat: this.trip.location_end.lat, lng: this.trip.location_end.lon};
        const bounds: ILatLng[] = [locBegin, locEnd];

        const options: GoogleMapOptions = {
            camera: {target: bounds, tilt: 1},
            styles: removeDefaultMarkers,
        };
        this.map = GoogleMaps.create('map_canvas', options);
        setTimeout(() => {
            const currentZoom: number = this.map.getCameraZoom();
            this.map.setCameraZoom(currentZoom - 1);
        }, 1000);

        const markerInit: Marker = this.map.addMarkerSync({
            title: 'Starting point of the route',
            icon: 'red',
            animation: 'DROP',
            position: locBegin,
        });
        const markerEnd: Marker = this.map.addMarkerSync({
            title: 'Finishing point of the route',
            icon: 'gray',
            animation: 'DROP',
            position: locEnd,
        });

        // marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        //     alert('clicked');
        // });
        // this.goToMyLocation();
    }

    // goToMyLocation() {
    //     this.map.clear();
    //
    //     // Get the location of you
    //     this.map.getMyLocation().then((location: MyLocation) => {
    //         console.log(JSON.stringify(location, null, 2));
    //
    //         // Move the map camera to the location with animation
    //         this.map.animateCamera({
    //             target: location.latLng,
    //             zoom: 17,
    //             duration: 5000,
    //         });
    //
    //         // add a marker
    //         const marker: Marker = this.map.addMarkerSync({
    //             title: '@ionic-native/google-maps plugin!',
    //             snippet: 'This plugin is awesome!',
    //             position: location.latLng,
    //             animation: GoogleMapsAnimation.BOUNCE,
    //         });
    //
    //         // show the infoWindow
    //         marker.showInfoWindow();
    //
    //         // If clicked it, display the alert
    //         marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
    //             console.log('clicked!');
    //         });
    //
    //         this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
    //             (data) => {
    //                 console.log('Click MAP', data);
    //             },
    //         );
    //     })
    //         .catch(err => {
    //             // this.loading.dismiss();
    //             console.log(err.error_message);
    //         });
    // }

    async confirmCancel($event: MouseEvent) {
        $event.stopPropagation();
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alert!',
            message: 'Are you sure you want to cancel this trip?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    },
                }, {
                    text: 'Yes, cancel',
                    handler: () => {
                        this.trip.status = 'CANCEL';
                        this.hasTravel = false;
                    },
                },
            ],
        });

        await alert.present();
    }

    async pushNotification(value: string) {
        this.loading = true;
        await this.orderService.setOrderOnRouteNotify(this.trip.id, value)
            .then(async (res: any) => {
                this.trip = res;
                this.loading = false;
                await this.storage.setOrderOnRoute(res);
            })
            .catch(error => {
                this.toast.handleError(error.status);
                this.loading = false;
            });
    }

    async doneJourney() {
        if (this.trip.notify !== 'REACHED') {
            await this.pushNotification('REACHED');
        }
        const modal: HTMLIonModalElement =
            await this.modalController.create({
                component: FinishRoutePage,
                componentProps: {
                    journey: this.trip,
                },
            });

        modal.onDidDismiss().then((detail: any) => {
            console.log('-> detail', detail);
            if (detail.data) {
                this.hasTravel = false;
            }
        });

        await modal.present();
    }

    goToReceiverChat() {
        const id = String(this.trip.user_id);
        this.router.navigate(['/tabs/chats', id]);
        this.intentProvider.chatReceiverUser = {id, name: this.trip.business_name};
    }
}
