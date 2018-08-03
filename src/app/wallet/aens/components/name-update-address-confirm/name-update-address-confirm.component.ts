import { Component, OnInit } from "@angular/core";
import { SetAddressConfirmRequest } from "@aens/models/setAddressConfirmRequest";
import { ModalViewComponent, DialogRef } from "@aerum/ui";

@Component({
  selector: "app-name-update-address-confirm",
  templateUrl: "./name-update-address-confirm.component.html",
  styleUrls: ["./name-update-address-confirm.component.scss"]
})
export class NameUpdateAddressConfirmComponent
  implements OnInit, ModalViewComponent<SetAddressConfirmRequest, any> {
  estimatedFeeInWei: number;
  maximumFeeInWei: number;

  constructor(public dialogRef: DialogRef<SetAddressConfirmRequest, any>) {}

  ngOnInit() {
    this.estimatedFeeInWei = this.dialogRef.data.gasPrice * this.dialogRef.data.estimatedFeeInGas;
    this.maximumFeeInWei = this.dialogRef.data.gasPrice * this.dialogRef.data.maximumFeeInGas;
  }

  accept() {
    this.dialogRef.close(null);
  }
}
