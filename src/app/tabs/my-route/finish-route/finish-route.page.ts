import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavParams, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
// import { CameraResultType, CameraSource, Device, Plugins } from '@capacitor/core';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { HandleImageProvider } from '../../../providers/handleImage.provider';
const win: any = window;

@Component({
    selector: 'app-finish-route',
    templateUrl: 'finish-route.page.html',
    styleUrls: ['finish-route.page.scss']
})
export class FinishRoutePage implements OnInit {

    myParameter: boolean;
    myOtherParameter: Date;
    private fileData: File | Blob;
    isTest = false;
    previewUrl: any;
    journey: any = {};
    slideOpts: { autoHeight: true, centeredSlides: true, loop: true };

    constructor(private modalController: ModalController,
                private actionSheetController: ActionSheetController,
                private router: Router,
                private navParams: NavParams,
                private platform: Platform,
                private camera: Camera) {
    }

    async ngOnInit() {
        this.isTest = this.platform.platforms()[2] === 'mobileweb';
        console.log('-> platform', this.platform.platforms());
        this.journey = {
            receptor: '',
            files: []
        };
    }

    ionViewWillEnter() {
        this.myParameter = this.navParams.get('aParameter');
        this.myOtherParameter = this.navParams.get('otherParameter');
    }

    async myDismiss() {
        const result: Date = new Date();
        await this.modalController.dismiss(false);
    }

    deleteImg(i: number) {
        this.journey.files.splice(i, 1);
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
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
        };

        const image = await this.camera.getPicture(options);
        await this.chargeImage(image);
    }

    async chargeImage(image: any) {
        const imageBlob = await HandleImageProvider.handleImageUpload(this.isTest, image);
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
            this.fileData = imageBlob;
            this.previewUrl = reader.result;
            this.journey.files.push(this.previewUrl);
        };
    }

    endJourney() {
        this.router.navigateByUrl('/tabs/historic').then(() => this.modalController.dismiss(true));
    }
}
