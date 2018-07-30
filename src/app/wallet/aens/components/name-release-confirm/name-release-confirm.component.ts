import { Component, OnInit } from "@angular/core";
import { NameReleaseConfirmRequest } from "@aens/models/nameReleaseConfirmRequest";
import { ModalViewComponent, DialogRef } from "@aerum/ui";

@Component({
  selector: "app-name-release-confirm",
  templateUrl: "./name-release-confirm.component.html",
  styleUrls: ["./name-release-confirm.component.scss"]
})
export class NameReleaseConfirmComponent
  implements OnInit, ModalViewComponent<NameReleaseConfirmRequest, any> {
  estimatedFeeInWei: number;
  maximumFeeInWei: number;

  constructor(public dialogRef: DialogRef<NameReleaseConfirmRequest, any>) {}

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
