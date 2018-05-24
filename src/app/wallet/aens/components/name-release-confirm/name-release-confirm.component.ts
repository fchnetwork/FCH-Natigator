import { Component, OnInit } from '@angular/core';
import { DialogRef } from 'ngx-modialog'; 
import { NameReleaseConfirmRequest } from "@aens/models/nameReleaseConfirmRequest";
import { DefaultModalContext } from '@app/shared/modals/models/default-modal-context.model';

@Component({
  selector: 'app-name-release-confirm',
  templateUrl: './name-release-confirm.component.html',
  styleUrls: ['./name-release-confirm.component.scss']
})
export class NameReleaseConfirmComponent implements OnInit {

  param: NameReleaseConfirmRequest;

  estimatedFeeInWei: number;
  maximumFeeInWei: number;

  constructor(private dialog: DialogRef<DefaultModalContext>) {
    if(dialog.context.param) {
      this.param = dialog.context.param as NameReleaseConfirmRequest;

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
