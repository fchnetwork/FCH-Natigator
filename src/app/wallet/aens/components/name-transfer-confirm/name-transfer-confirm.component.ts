import { Component, OnInit } from "@angular/core";
import { NameTransferConfirmRequest } from "@aens/models/nameTransferConfirmRequest";
import { ModalViewComponent, DialogRef } from "@aerum/ui";

@Component({
  selector: "app-name-transfer-confirm",
  templateUrl: "./name-transfer-confirm.component.html",
  styleUrls: ["./name-transfer-confirm.component.scss"]
})
export class NameTransferConfirmComponent
  implements OnInit, ModalViewComponent<NameTransferConfirmRequest, any> {
  estimatedFeeInWei: number;
  maximumFeeInWei: number;

  constructor(public dialogRef: DialogRef<NameTransferConfirmRequest, any>) {}

  ngOnInit() {
    this.estimatedFeeInWei =
      this.dialogRef.data.gasPrice * this.dialogRef.data.estimatedFeeInGas;
    this.maximumFeeInWei =
      this.dialogRef.data.gasPrice * this.dialogRef.data.maximumFeeInGas;
  }

  accept() {
    this.dialogRef.close(null);
  }
}
