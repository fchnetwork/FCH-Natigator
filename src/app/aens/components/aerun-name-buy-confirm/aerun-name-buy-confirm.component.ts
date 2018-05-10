import { Component, OnInit } from '@angular/core';
import { DialogRef } from 'ngx-modialog';

import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { BasicModalContext } from '@app/shared/components/modals/basic-modal/basic-modal.component';
import { BuyConfirmRequest } from '@app/aens/models/buyConfirmRequest';
import { BuyConfirmReponse } from '@app/aens/models/buyConfirmReponse';

@Component({
  selector: 'app-aerun-name-buy-confirm',
  templateUrl: './aerun-name-buy-confirm.component.html',
  styleUrls: ['./aerun-name-buy-confirm.component.scss']
})
export class AerunNameBuyConfirmComponent implements OnInit {

  param: BuyConfirmRequest;

  buyerAvatar: string;
  ansOwnerAvatar: string;

  estimatedFeeInWei: number;
  maximumFeeInWei: number;

  constructor(
    public dialog: DialogRef<BasicModalContext>,
    public authServ: AuthenticationService) {
      if(dialog.context.param) {
        this.param = dialog.context.param as BuyConfirmRequest;

        this.buyerAvatar = this.authServ.generateCryptedAvatar(this.param.buyer);
        this.ansOwnerAvatar = this.authServ.generateCryptedAvatar(this.param.ansOwner);

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
