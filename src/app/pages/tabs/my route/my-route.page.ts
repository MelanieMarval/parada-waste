import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { FinishRoutePage } from './finish-route/finish-route.page';
import {
    GoogleMap,
    GoogleMapOptions,
    GoogleMaps,
    GoogleMapsAnimation,
    GoogleMapsEvent,
    Marker,
    MyLocation
} from '@ionic-native/google-maps';

const removeDefaultMarkers = [
    {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [
            {visibility: 'off'}
        ]
    }
];

@Component({
    selector: 'app-my-route',
    templateUrl: 'my-route.page.html',
    styleUrls: ['my-route.page.scss']
})
export class MyRoutePage implements OnInit, AfterViewInit {

    hasTravel = true;
    travel: any = {};
    isNear = true;
    map: GoogleMap;
    address: string;

    constructor(private alertController: AlertController,
                private platform: Platform,
                private modalController: ModalController) {
    }

    ngOnInit(): void {
        // get Travel by code and use interface with data
        this.travel = {
            id: 545454,
            code: 8552,
            positionBegin: 'SEDE Venezuela',
            positionEnd: 'calle 156 c/c 189 Urb. Alianza, El Mirador, Bolivar',
            status: 'PENDING', // PENDING, PROCESS, DONE, CANCEL
            mileage: 15000,
            processedAt: new Date(),
            doneAt: null,
            cancelAt: null
        };
    }

    ngAfterViewInit() {
        if (this.platform.is('cordova')) {
            this.loadMap();
        }
    }

    loadMap() {
        const options: GoogleMapOptions = {
            camera: {
                target: {
                    lat: 43.0741704,
                    lng: -89.3809802
                },
                zoom: 18,
                tilt: 30
            },
            styles: removeDefaultMarkers
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

    goToMyLocation() {
        this.map.clear();

        // Get the location of you
        this.map.getMyLocation().then((location: MyLocation) => {
            console.log(JSON.stringify(location, null, 2));

            // Move the map camera to the location with animation
            this.map.animateCamera({
                target: location.latLng,
                zoom: 17,
                duration: 5000
            });

            // add a marker
            const marker: Marker = this.map.addMarkerSync({
                title: '@ionic-native/google-maps plugin!',
                snippet: 'This plugin is awesome!',
                position: location.latLng,
                animation: GoogleMapsAnimation.BOUNCE
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
                }
            );
        })
            .catch(err => {
                // this.loading.dismiss();
                console.log(err.error_message);
            });
    }

    async confirmCancel() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alerta!',
            message: 'Esta seguro de que desea cancelar este viaje?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Si, cancelar',
                    handler: () => {
                        this.travel.cancelAt = new Date();
                        this.travel.status = 'CANCEL';
                        this.hasTravel = false;
                    }
                }
            ]
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
                    aParameter: true,
                    otherParameter: new Date()
                }
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
