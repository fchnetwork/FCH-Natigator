import { TranslateService } from '@ngx-translate/core';
import {
  QrScannerRequest,
  QrScannerResponse
} from "@app/shared/components/qr-scanner/qr-scanner.component";
import { ModalService } from "./../modal-service/modal.service";
import { Injectable } from "@angular/core";
import { DialogResult } from "@aerum/ui";

@Injectable()
export class QrScannerService {
  constructor(private modalService: ModalService, private translate: TranslateService) {}


  /**
   * Opens a modal window that scans any QR code.
   *
   * @param {string} textResourceName Name of the text resource to show as a subtitle of the QR dialog.
   * @param {(qrCode: string) => { valid: boolean; errorMessage: string }} validator Custom validator that determines whether the code scanned is valid or shows an error message with specified resource name.
   * @returns {Promise<QrScannerResponse>}
   * @memberof QrScannerService
   */
  async scanQrCode(textResourceName: string, validator: (qrCode: string) => { valid: boolean; errorMessageResourceName: string }): Promise<QrScannerResponse> {
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
}
