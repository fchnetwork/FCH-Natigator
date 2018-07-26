import { Component, OnInit } from '@angular/core';
import { LoadedSwap } from '@swap/models/models';
import { AuthenticationService } from '@core/authentication/authentication-service/authentication.service';
import { ModalViewComponent, DialogRef } from '@aerum/ui';

export class LoadSwapConfirmResponse {
  confirmed: boolean;
  rejected: boolean;
}

@Component({
  selector: 'app-load-swap-confirm',
  templateUrl: './load-swap-confirm.component.html',
  styleUrls: ['./load-swap-confirm.component.scss']
})
export class LoadSwapConfirmComponent implements ModalViewComponent<LoadedSwap, LoadSwapConfirmResponse>, OnInit {

  showConfirm: boolean;
  showReject: boolean;

  constructor(
    public dialogRef: DialogRef<LoadedSwap, LoadSwapConfirmResponse>,
    private authService: AuthenticationService
  ) {
  }

  async ngOnInit() {
    const keystore = await this.authService.showKeystore();
    const currentAddress = "0x" + keystore.address;

    const isSwapOpened = this.dialogRef.data.status === 'Open';
    const isCloseTrader = currentAddress.toLowerCase() === this.dialogRef.data.counterpartyTrader.toLowerCase();
    this.showConfirm = isCloseTrader && isSwapOpened;
    this.showReject = isSwapOpened;
  }

  onConfirm() {
    this.dialogRef.close({confirmed: true, rejected: false});
  }

  onReject() {
    this.dialogRef.close({confirmed: false, rejected: true});
  }
}
