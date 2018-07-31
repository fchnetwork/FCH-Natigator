import { TranslateService } from '@ngx-translate/core';
import { Data } from "@angular/router";
import { ModalViewComponent, DialogRef } from "@aerum/ui";
import { Component, OnInit } from "@angular/core";

export class QrScannerRequest {
  text: string;
  validator: (qrCode: string) => { valid: boolean; errorMessageResourceName: string };
}

export class QrScannerResponse {
  scanSuccessful: boolean;
  result: string;
}

@Component({
  selector: "app-qr-scanner",
  templateUrl: "./qr-scanner.component.html",
  styleUrls: ["./qr-scanner.component.scss"]
})
export class QrScannerComponent
  implements ModalViewComponent<QrScannerRequest, QrScannerResponse> {
  errorMessage: string;

  constructor(
    public dialogRef: DialogRef<QrScannerRequest, QrScannerResponse>,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  codeScanned(qrCode) {
    const isValid = this.dialogRef.data.validator(qrCode);
    console.log(isValid);

    if (isValid.valid) {
      this.dialogRef.close({
        scanSuccessful: true,
        result: qrCode
      });
    } else {
      this.errorMessage = this.translate.instant(isValid.errorMessageResourceName);
    }
  }
}
