import { Injectable } from '@angular/core';
// @ts-ignore
import imageCompression from 'browser-image-compression';

@Injectable({
    providedIn: 'root'
})
export class HandleImageProvider {

    constructor() {
    }

    static async handleImageUpload(isTest: boolean, image: any) {
        const imageFile = isTest ? image.target.files[0] : await imageCompression.getFilefromDataUrl(image, 'paradaWaste');
        const options = {
            maxSizeMB: 0.100,
            maxWidthOrHeight: 1020,
            onProgress: undefined,
        };
        try {
            return await imageCompression(imageFile, options);
        } catch (error) {
            console.log(error);
        }

    }

}

