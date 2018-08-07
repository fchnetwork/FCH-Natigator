import { Component, OnInit, Input } from "@angular/core";

import { environment } from '@env/environment';
import "rxjs/add/operator/first";

import { TranslateService } from "@ngx-translate/core";
import { AddressKeyValidationService } from "@app/core/validation/address-key-validation.service";
import { ImportWalletService } from "@app/core/transactions/import-wallet-service/import-wallet.service";
import { QrScannerService } from "./../../../core/general/qr-scanner/qr-scanner.service";
import { MobileQrScannerService } from "@app/core/general/mobile-qr-scanner/mobile-qr-scanner.service";
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';

@Component({
  selector: "app-import-wallet-box",
  templateUrl: "./import-wallet-box.component.html",
  styleUrls: ["./import-wallet-box.component.scss"]
})
export class ImportWalletBoxComponent implements OnInit {
  @Input() privateKey: string;

  constructor(
    private addressKeyValidator: AddressKeyValidationService,
    private importWalletService: ImportWalletService,
    private qrScanner: QrScannerService,
    private mobileQrScanner: MobileQrScannerService,
    private translateService: TranslateService,
    private notificationService: InternalNotificationService
  ) {}

  ngOnInit() {}

  isValid(): boolean {
    return this.addressKeyValidator.isPrivateKey(this.privateKey);
  }

  async scanQrCode() {
    if(environment.isMobileBuild){
      await this.scanQrCodeFromMobile();
    } else {
      await this.scanQrCodeFromWeb();
    }
  }

  async scanQrCodeFromWeb() {
    const scannerResult = await this.qrScanner.scanQrCode("SHARED.IMPORT_WALLET.QR_CODE_TEXT", qrCode => {
      return {
        valid: this.addressKeyValidator.isPrivateKey(qrCode),
        errorMessageResourceName: "SHARED.IMPORT_WALLET.QR_CODE_ERROR"
      };
    });

    if(scannerResult.scanSuccessful) {
      this.privateKey = scannerResult.result;
    }
  }

  async scanQrCodeFromMobile() {
    const result = await this.mobileQrScanner.scanQrCode();
    if(!this.addressKeyValidator.isPrivateKey(result)) {
      const msg = this.translateService.instant("SHARED.IMPORT_WALLET.QR_CODE_ERROR");
      this.notificationService.showMessage(msg, "Error");
      return;
    }
    this.privateKey = result;
  }

  importWallet() {
    if (this.isValid()) {
      this.importWalletService
        .importWalletToCurrentAddress(this.privateKey)
        .then(w => console.log("Done"))
        .catch(error => console.log(error));
    }
  }
}
