import { ModalViewComponent, DialogRef } from "@aerum/ui";
import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { NameBuyConfirmRequest } from "@aens/models/nameBuyConfirmRequest";

@Component({
  selector: "app-name-buy-confirm",
  templateUrl: "./name-buy-confirm.component.html",
  styleUrls: ["./name-buy-confirm.component.scss"]
})
export class NameBuyConfirmComponent
  implements OnInit, ModalViewComponent<NameBuyConfirmRequest, any> {

  estimatedFeeInWei: number;
  maximumFeeInWei: number;

  constructor(
    public dialogRef: DialogRef<NameBuyConfirmRequest, any>,
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    console.log(this.dialogRef);
    this.estimatedFeeInWei = this.dialogRef.data.gasPrice * this.dialogRef.data.estimatedFeeInGas;
    this.maximumFeeInWei = this.dialogRef.data.gasPrice * this.dialogRef.data.maximumFeeInGas;
  }

  accept() {
    this.dialogRef.close(null);
  }
}
