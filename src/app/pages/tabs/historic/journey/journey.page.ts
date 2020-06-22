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
    GoogleMapOptions
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
    selector: 'app-journey',
    templateUrl: 'journey.page.html',
    styleUrls: ['journey.page.scss']
})
export class JourneyPage implements OnInit {

    travelCode: string;
    travel: any = {};
    map: GoogleMap;
    address: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private platform: Platform,
                private alertController: AlertController,
                private translate: TranslateService) {
        this.travelCode = route.snapshot.params.code;
    }

    ngOnInit(): void {
        this.platform.ready();
        this.loadMap();
        // get Travel by code and use interface with data
        this.travel = {
            id: 545454,
            code: this.travelCode,
            positionBegin: 'SEDE Venezuela',
            positionEnd: 'calle 156 c/c 189 Urb. Alianza, El Mirador, Bolivar',
            status: 'PENDING', // PENDING, PROCESS, DONE, CANCEL
            mileage: 15000,
            processedAt: null,
            doneAt: null,
            cancelAt: null
        };
    }

    loadMap() {
        const options: GoogleMapOptions = {
            camera: {
                target: {
                    lat: 43.0741704,
                    lng: -89.3809802
                },
                zoom: 18,
                tilt: 1 // 30
            },
            // styles: removeDefaultMarkers
        };
        this.map = GoogleMaps.create('map_canvas', options);
        this.goToMyLocation();
    }

    goToMyLocation(){
        this.map.clear();

        // Get the location of you
        this.map.getMyLocation().then((location: MyLocation) => {
            console.log(JSON.stringify(location, null ,2));

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

    async enterMileage() {
        const text = await this.translate.get('journey.prompt').toPromise();
        const alert = await this.alertController.create({
            cssClass: 'prompt-primary',
            header: text.title,
            inputs: [{
                name: 'mileage',
                type: 'number',
                value: 0
            }],
            buttons: [
                {
                    text: text.buttonCancel,
                    role: 'cancel',
                    cssClass: 'light',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: text.buttonAccept,
                    cssClass: 'light',
                    handler: (alertData) => {
                        console.log(alertData);
                        if (alertData.mileage > 0) {
                            this.router.navigateByUrl('/tabs/my-route');
                        }
                    }
                }
            ]
        });
        await alert.present();
    }


}
