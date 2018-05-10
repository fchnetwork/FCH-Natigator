import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { BasicModalContext } from '@app/shared/components/modals/basic-modal/basic-modal.component';  
import { LoadedSwap } from '@app/wallet/swap/models/models';
import { AuthenticationService } from '@app/core/authentication-service/authentication.service';

@Component({
  selector: 'app-load-swap-confirm',
  templateUrl: './load-swap-confirm.component.html',
  styleUrls: ['./load-swap-confirm.component.scss']
})
export class LoadSwapConfirmComponent implements ModalComponent<BasicModalContext>, OnInit {

  param: LoadedSwap;

  showConfirm: boolean;
  showReject: boolean;

  constructor(
    public dialog: DialogRef<BasicModalContext>,
    private authService: AuthenticationService
  ) { 
    this.param = dialog.context.param;
  }

  async ngOnInit() {
    const keystore = await this.authService.showKeystore();
    const currentAddress = "0x" + keystore.address;

    const isSwapOpened = this.param.status === 'Open';
    const isCloseTrader = currentAddress.toLowerCase() === this.param.counterpartyTrader.toLowerCase();
    this.showConfirm = isCloseTrader && isSwapOpened;
    this.showReject = isSwapOpened;
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
