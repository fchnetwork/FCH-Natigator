import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';

declare const window: any;

@Injectable()
export class MobileQrScannerService {

  private options: {
    preferFrontCamera : false, // iOS and Android
    showFlipCameraButton : true, // iOS and Android
    showTorchButton : true, // iOS and Android
    formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
    orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
    disableAnimations : false, // iOS
    disableSuccessBeep: false // iOS and Android
  };

  constructor(private translateService: TranslateService,
    private notificationService: InternalNotificationService)
  { }

  async scanQrCode(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      window.cordova.plugins.barcodeScanner.scan(
        result => {
          if(result.cancelled) {
            const msg = this.translateService.instant('SHARED.QR_SCAN.QR_CODE_SCANNING_CANCELLED');
            this.notificationService.showMessage(msg, 'Done');
            reject('canceled');
          }else {
            resolve(result.text);
          }
        },
        error => {
          const msg = this.translateService.instant('SHARED.QR_SCAN.QR_CODE_SCANNING_FAILED');
          this.notificationService.showMessage(`${msg} ${error}`, 'Error');
          reject(error);
        },
       this.options);
    });
  }
}
