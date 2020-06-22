export class PlatformUtils {

    static isTest() {
        return !window.hasOwnProperty('cordova');
    }
}
