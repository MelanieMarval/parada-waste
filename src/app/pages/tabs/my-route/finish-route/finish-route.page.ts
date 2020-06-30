import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavParams, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
// import { CameraResultType, CameraSource, Device, Plugins } from '@capacitor/core';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { HandleImageProvider } from '../../../../providers/handleImage.provider';
import { File } from '@ionic-native/file/ngx';
import { PlatformUtils } from '../../../../utils/platform.utils';
import { OrderService } from '../../../../services/order.service';
import { Order } from '../../../../services/interfaces/order';

const win: any = window;

@Component({
    selector: 'app-finish-route',
    templateUrl: 'finish-route.page.html',
    styleUrls: ['finish-route.page.scss']
})
export class FinishRoutePage implements OnInit {

    private fileData: File | Blob;
    isTest = false;
    previewUrl: any;
    endJourney: any = {};
    journey: Order;
    slideOpts: { autoHeight: true, centeredSlides: true, loop: true };

    constructor(private modalController: ModalController,
                private actionSheetController: ActionSheetController,
                private router: Router,
                private navParams: NavParams,
                private platform: Platform,
                private camera: Camera,
                private orderService: OrderService) {
    }

    async ngOnInit() {
        this.isTest = PlatformUtils.isTest();
        this.endJourney = {
            receptor: '',
            files: []
        };
    }

    ionViewWillEnter() {
        this.journey = this.navParams.get('journey');
    }

    async myDismiss() {
        const result: Date = new Date();
        await this.modalController.dismiss(false);
    }

    deleteImg(i: number) {
        this.endJourney.files.splice(i, 1);
    }

    async takeImage() {
        const self = this;
        const actionSheet = await this.actionSheetController.create({
            cssClass: 'action-sheet-custom-class',
            header: 'Seleccione una opción:',
            buttons: [{
                text: 'Tomar una Foto',
                icon: 'camera',
                handler: () => {
                    self.captureImage(this.camera.PictureSourceType.CAMERA);
                }
            }, {
                text: 'Buscar Foto en la Galeria',
                icon: 'image',
                handler: () => {
                    self.captureImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            }]
        });
        await actionSheet.present();
    }

    async captureImage(sourceType: any) {
        const options: CameraOptions = {
            quality: 100,
            sourceType,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
        };

        const image = await this.camera.getPicture(options);
        const imgUrl = 'data:image/png;base64,' + image;

        await this.chargeImage(imgUrl);
    }

    async chargeImage(image: any) {
        const imageBlob = await HandleImageProvider.handleImageUpload(this.isTest, image);
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
            this.fileData = imageBlob;
            this.previewUrl = reader.result;
            this.endJourney.files.push(this.previewUrl);
        };
    }

    finishJourney() {
        this.router.navigateByUrl('/tabs/historic').then(() => this.modalController.dismiss(true));
    }
}
