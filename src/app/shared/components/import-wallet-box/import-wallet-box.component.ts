import { Component, OnInit, Input } from "@angular/core";

import "rxjs/add/operator/first";

import { AddressKeyValidationService } from "@app/core/validation/address-key-validation.service";
import { ImportWalletService } from "@app/core/transactions/import-wallet-service/import-wallet.service";
import { QrScannerService } from "./../../../core/general/qr-scanner/qr-scanner.service";

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
    private qrScanner: QrScannerService
  ) {}

  ngOnInit() {}

  isValid(): boolean {
    return this.addressKeyValidator.isPrivateKey(this.privateKey);
  }

  async scanQrCode() {
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

  importWallet() {
    if (this.isValid()) {
      this.importWalletService
        .importWalletToCurrentAddress(this.privateKey)
        .then(w => console.log("Done"))
        .catch(error => console.log(error));
    }
  }
}
