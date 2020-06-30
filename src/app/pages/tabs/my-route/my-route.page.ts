import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { FinishRoutePage } from './finish-route/finish-route.page';
import {
    Environment,
    GoogleMap,
    GoogleMapOptions,
    GoogleMaps,
    GoogleMapsAnimation,
    GoogleMapsEvent,
    Marker,
    MyLocation,
    ILatLng,
} from '@ionic-native/google-maps';
import { StorageService } from '../../../services/storage.service';
import { OrderService } from '../../../services/order.service';
import { ToastProvider } from '../../../providers/toast.provider';
import { Order } from '../../../services/interfaces/order';

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
export class MyRoutePage implements OnInit, AfterViewInit {

    loading: boolean;
    hasTravel = false;
    travel: Order;
    isNear = true;
    map: GoogleMap;
    collapse = true;

    constructor(private alertController: AlertController,
                private platform: Platform,
                private modalController: ModalController,
                private toast: ToastProvider,
                private orderService: OrderService) {
    }

    async ngOnInit() {
        this.getOrderOnRoute();
    }

    getOrderOnRoute() {
        this.loading = true;
        this.orderService.getOrderOnRoute()
            .then((res: any) => {
                if (res.status) {
                    this.travel = res.order;
                    this.hasTravel = true;
                } else {
                    this.hasTravel = false;
                }
                this.loading = false;
                console.log('-> res', res);
            }).catch(error => {
                this.loading = false;
                this.toast.handleError(error.status);
            });
    }

    ngAfterViewInit() {
        if (this.platform.is('cordova')) {
            this.loadMap();
        }
    }

    loadMap() {
        Environment.setEnv({
            // api key for server
            API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyD3t5VAdEBMdICcY9FyVcgBHlkeu72OI4s',
            // api key for local development
            API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyD3t5VAdEBMdICcY9FyVcgBHlkeu72OI4s',
        });

        const bounds: ILatLng[] = [
            {lat: 40.712216, lng: -74.22655},
            {lat: 40.773941, lng: -74.12544},
        ];

        const options: GoogleMapOptions = {
            camera: {
                target: bounds,
                zoom: 18,
                tilt: 30,
            },
            styles: removeDefaultMarkers,
        };
        this.map = GoogleMaps.create('map_canvas', options);

        const marker: Marker = this.map.addMarkerSync({
            title: 'Ionic',
            icon: 'red',
            animation: 'DROP',
            position: {
                lat: 43.0741904,
                lng: -89.3809802
            }
        });

        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            alert('clicked');
        });
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
                        this.travel.status = 'CANCEL';
                        this.hasTravel = false;
                    },
                },
            ],
        });

        await alert.present();
    }

    pushNotification() {
        this.isNear = false;
    }

    async doneJourney() {
        const modal: HTMLIonModalElement =
            await this.modalController.create({
                component: FinishRoutePage,
                componentProps: {
                    journey: this.travel,
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
}
