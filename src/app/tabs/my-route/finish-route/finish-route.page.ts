import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonInput, ModalController, NavParams } from '@ionic/angular';
import { CameraResultType, CameraSource, Device, Plugins } from '@capacitor/core';
import { HandleImageProvider } from '../../../providers/handleImage.provider';
import { Router } from '@angular/router';

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
                private navParams: NavParams) {
    }

    async ngOnInit() {
        const info = await Device.getInfo();
        this.isTest = info.platform === 'web';
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
                    self.captureImage(true);
                }
            }, {
                text: 'Buscar Foto en la Galeria',
                icon: 'image',
                handler: () => {
                    self.captureImage(false);
                }
            }]
        });
        await actionSheet.present();
    }

    async captureImage(fromCamera: boolean) {
        const options = {
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: fromCamera ? CameraSource.Camera : CameraSource.Photos,
        };
        const image = await Plugins.Camera.getPhoto(options);
        await this.chargeImage(image.dataUrl);
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
