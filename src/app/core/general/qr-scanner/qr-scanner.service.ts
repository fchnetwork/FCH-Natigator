import { EnvironmentService } from "@core/general/environment-service/environment.service";
import {
  QrScannerRequest,
  QrScannerResponse
} from "@app/shared/components/qr-scanner/qr-scanner.component";
import { ModalService } from "./../modal-service/modal.service";
import { Injectable } from "@angular/core";
import { DialogResult } from "@aerum/ui";
import { TranslateService } from "@ngx-translate/core";
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';

declare const window: any;

@Injectable()
export class QrScannerService {
  private mobileOptions: {
    preferFrontCamera : false, // iOS and Android
    showFlipCameraButton : true, // iOS and Android
    showTorchButton : true, // iOS and Android
    formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
    orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
    disableAnimations : false, // iOS
    disableSuccessBeep: false // iOS and Android
  };

  constructor(private modalService: ModalService,
    private translate: TranslateService,
    private notificationService: InternalNotificationService,
    private environment: EnvironmentService)
  { }

  /**
   * Opens a modal window that scans any QR code.
   *
   * @param {string} textResourceName Name of the text resource to show as a subtitle of the QR dialog.
   * @param {(qrCode: string) => { valid: boolean; errorMessage: string }} validator Custom validator that determines whether the code scanned is valid or shows an error message with specified resource name.
   * @returns {Promise<QrScannerResponse>}
   * @memberof QrScannerService
   */
  async scanQrCode(textResourceName: string, validator: (qrCode: string) => { valid: boolean; errorMessageResourceName: string }): Promise<QrScannerResponse> {
    if(this.environment.get().isMobileBuild) {
      return await this.scanQrCodeForMobile(validator);
    } else {
      return await this.scanQrCodeForWeb(textResourceName, validator);
    }
  }

  private async scanQrCodeForWeb(textResourceName: string, validator: (qrCode: string) => { valid: boolean; errorMessageResourceName: string }): Promise<QrScannerResponse> {
    return new Promise<QrScannerResponse>(async (resolve, reject) => {
      try {
        const request: QrScannerRequest = {
          text: this.translate.instant(textResourceName),
          validator
        };

        const modalResponse = await this.modalService.openQrScanner(request);

        if (modalResponse.dialogResult === DialogResult.OK) {
          resolve(modalResponse.result);
        } else {
          resolve({
            scanSuccessful: false,
            result: null
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  private async scanQrCodeForMobile(validator: (qrCode: string) => { valid: boolean; errorMessageResourceName: string }): Promise<QrScannerResponse> {
    return new Promise<QrScannerResponse>((resolve, reject) => {
      window.cordova.plugins.barcodeScanner.scan(
        result => {
          if(result.cancelled) {
            const msg = this.translate.instant('SHARED.QR_SCAN.QR_CODE_SCANNING_CANCELLED');
            this.notificationService.showMessage(msg, this.translate.instant('DONE'));
            resolve({
              scanSuccessful: false,
              result: null
            });
            return;
          }

          const validatorResult = validator(result.text);
          if(validatorResult.valid) {
            resolve({
              scanSuccessful: true,
              result: result.text
            });
          } else {
            const msg = this.translate.instant(validatorResult.errorMessageResourceName);
            this.notificationService.showMessage(msg, this.translate.instant('ERROR'));
            resolve({
              scanSuccessful: false,
              result: null
            });
          }
        },
        error => {
          const msg = this.translate.instant('SHARED.QR_SCAN.QR_CODE_SCANNING_FAILED');
          this.notificationService.showMessage(`${msg} ${error}`, this.translate.instant('ERROR'));
          reject(error);
        },
       this.mobileOptions);
    });
  }
}
