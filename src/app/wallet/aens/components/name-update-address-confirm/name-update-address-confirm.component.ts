import { Component, OnInit } from '@angular/core';
import { DialogRef } from 'ngx-modialog';

import { BasicModalContext } from '@shared/components/modals/basic-modal/basic-modal.component';
import { SetAddressConfirmRequest } from '@aens/models/setAddressConfirmRequest';

@Component({
  selector: 'app-name-update-address-confirm',
  templateUrl: './name-update-address-confirm.component.html',
  styleUrls: ['./name-update-address-confirm.component.scss']
})
export class NameUpdateAddressConfirmComponent implements OnInit {

  param: SetAddressConfirmRequest;

  estimatedFeeInWei: number;
  maximumFeeInWei: number;

  constructor(private dialog: DialogRef<BasicModalContext>) {
    if(dialog.context.param) {
      this.param = dialog.context.param as SetAddressConfirmRequest;

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
