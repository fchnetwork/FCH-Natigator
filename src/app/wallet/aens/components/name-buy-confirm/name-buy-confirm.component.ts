import { Component, OnInit } from '@angular/core';
import { DialogRef } from 'ngx-modialog'; 
import { AuthenticationService } from '@core/authentication/authentication-service/authentication.service'; 
import { NameBuyConfirmRequest } from '@aens/models/nameBuyConfirmRequest';
import { DefaultModalContext } from '@app/shared/modals/models/default-modal-context.model';

@Component({
  selector: 'app-name-buy-confirm',
  templateUrl: './name-buy-confirm.component.html',
  styleUrls: ['./name-buy-confirm.component.scss']
})
export class NameBuyConfirmComponent implements OnInit {

  param: NameBuyConfirmRequest;

  buyerAvatar: string;
  ansOwnerAvatar: string;

  estimatedFeeInWei: number;
  maximumFeeInWei: number;

  constructor(
    public dialog: DialogRef<DefaultModalContext>,
    public authenticationService: AuthenticationService) {
      if(dialog.context.param) {
        this.param = dialog.context.param as NameBuyConfirmRequest;

        this.buyerAvatar = this.authenticationService.generateCryptedAvatar(this.param.buyer);
        this.ansOwnerAvatar = this.authenticationService.generateCryptedAvatar(this.param.ansOwner);

        this.estimatedFeeInWei = this.param.gasPrice * this.param.estimatedFeeInGas;
        this.maximumFeeInWei = this.param.gasPrice * this.param.maximumFeeInGas;
      }
    }

  ngOnInit() {
  }

  accept() {
    this.dialog.close({ accepted: true });
  }

  dismiss() {
    this.dialog.close({ accepted: false });
  }
}
