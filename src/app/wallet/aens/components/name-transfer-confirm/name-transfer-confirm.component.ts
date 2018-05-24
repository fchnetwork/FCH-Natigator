import { Component, OnInit } from '@angular/core';
import { DialogRef } from 'ngx-modialog'; 
import { NameTransferConfirmRequest } from "@aens/models/nameTransferConfirmRequest";
import { DefaultModalContext } from '@app/shared/modals/models/default-modal-context.model';

@Component({
  selector: 'app-name-transfer-confirm',
  templateUrl: './name-transfer-confirm.component.html',
  styleUrls: ['./name-transfer-confirm.component.scss']
})
export class NameTransferConfirmComponent implements OnInit {

  param: NameTransferConfirmRequest;

  estimatedFeeInWei: number;
  maximumFeeInWei: number;

  constructor(private dialog: DialogRef<DefaultModalContext>) {
    if(dialog.context.param) {
      this.param = dialog.context.param as NameTransferConfirmRequest;

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
