import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    Marker,
    GoogleMapsAnimation,
    MyLocation,
    GoogleMapOptions,
    Environment,
} from '@ionic-native/google-maps';
import { IntentProvider } from '../../../../providers/intent.provider';
import { PlatformUtils } from '../../../../utils/platform.utils';
import { OrderService } from '../../../../services/order.service';
import { ToastProvider } from '../../../../providers/toast.provider';
import { OrderStatusEnum } from '../../../../domain/order-status.enum';
import { StorageService } from '../../../../services/storage.service';
import { Order } from '../../../../services/interfaces/order';

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
    selector: 'app-journey',
    templateUrl: 'journey.page.html',
    styleUrls: ['journey.page.scss'],
})
export class JourneyPage implements OnInit {

    STATUS = OrderStatusEnum;
    travelCode: string;
    travel: Order;
    map: GoogleMap;
    address: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private platform: Platform,
                private alertController: AlertController,
                private intentProvider: IntentProvider,
                private translate: TranslateService,
                private orderService: OrderService,
                private toast: ToastProvider,
                private storage: StorageService) {
        this.travelCode = route.snapshot.params.code;
    }

    ngOnInit(): void {
        this.getJourneyDetails(this.route.snapshot.params.id);
        this.loadMap();
        // get Travel by code and use interface with data
        this.travel = this.intentProvider.orderToView;
        console.log('-> this.travel', this.travel);
    }


    private getJourneyDetails(id: number) {
        this.orderService.getOrderById(id)
            .then(res => {
                console.log('-> res', res);
            }).catch(error => this.toast.handleError(error.status));
    }

    loadMap() {
        if (!PlatformUtils.isTest()) {
            Environment.setEnv({
                // api key for server
                API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyD3t5VAdEBMdICcY9FyVcgBHlkeu72OI4s',
                // api key for local development
                API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyD3t5VAdEBMdICcY9FyVcgBHlkeu72OI4s',
            });

            const options: GoogleMapOptions = {
                camera: {
                    target: {
                        lat: 43.0741704,
                        lng: -89.3809802,
                    },
                    zoom: 18,
                    tilt: 1, // 30
                },
                // styles: removeDefaultMarkers
            };
            this.map = GoogleMaps.create('map_canvas_journey', options);
            this.goToMyLocation();
        }
    }

    goToMyLocation() {
        this.map.clear();

        // Get the location of you
        this.map.getMyLocation().then((location: MyLocation) => {
            console.log(JSON.stringify(location, null, 2));

            // Move the map camera to the location with animation
            this.map.animateCamera({
                target: location.latLng,
                zoom: 17,
                duration: 5000,
            });

            // add a marker
            const marker: Marker = this.map.addMarkerSync({
                title: '@ionic-native/google-maps plugin!',
                snippet: 'This plugin is awesome!',
                position: location.latLng,
                animation: GoogleMapsAnimation.BOUNCE,
            });

            // show the infoWindow
            marker.showInfoWindow();

            // If clicked it, display the alert
            marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                console.log('clicked!');
            });

            this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
                (data) => {
                    console.log('Click MAP', data);
                },
            );
        })
            .catch(err => {
                // this.loading.dismiss();
                console.log(err.error_message);
            });
    }

    async enterMileage() {
        const text = await this.translate.get('journey.prompt').toPromise();
        const alert = await this.alertController.create({
            cssClass: 'prompt-primary',
            header: text.title,
            inputs: [{
                name: 'mileage',
                type: 'number',
                value: 0,
            }],
            buttons: [
                {
                    text: text.buttonCancel,
                    role: 'cancel',
                    cssClass: 'light',
                    handler: () => {
                        console.log('Confirm Cancel');
                    },
                }, {
                    text: text.buttonAccept,
                    cssClass: 'light',
                    handler: (alertData) => {
                        console.log(alertData);
                        if (alertData.mileage > 0) {
                            this.startJourney(alertData.mileage);
                        }
                    },
                },
            ],
        });
        await alert.present();
    }

    private startJourney(mileage) {
        const params = {milleage_begin: mileage};
        this.orderService.startTrip(this.travel.id, params)
            .then(async res => {
                await this.storage.setOrderOnRoute(res);
                this.intentProvider.updateRoute = true;
                this.router.navigateByUrl('/tabs/my-route');
            }).catch(error => {
                this.toast.handleError(error.status);
            });
    }
}
