import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { BasicModalContext } from '@app/shared/components/modals/basic-modal/basic-modal.component';
import { LoadedSwap } from '@app/swap/swap.models';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';

@Component({
  selector: 'app-load-swap-confirm',
  templateUrl: './load-swap-confirm.component.html',
  styleUrls: ['./load-swap-confirm.component.scss']
})
export class LoadSwapConfirmComponent implements ModalComponent<BasicModalContext>, OnInit {

  param: LoadedSwap;

  isCloser: boolean;

  constructor(
    public dialog: DialogRef<BasicModalContext>,
    private authService: AuthenticationService
  ) { 
    this.param = dialog.context.param;
  }

  async ngOnInit() {
    const keystore = await this.authService.showKeystore();
    const currentAddress = "0x" + keystore.address;

    this.isCloser = currentAddress.toLowerCase() === this.param.counterpartyTrader.toLowerCase();
  }

  onConfirm() {
    this.dialog.close({confirmed: true, rejected: false});
  }

  onReject() {
    this.dialog.close({confirmed: false, rejected: true});
  }

  onCancel() {
    this.dialog.close({confirmed: false, rejected: false});
  }
}
