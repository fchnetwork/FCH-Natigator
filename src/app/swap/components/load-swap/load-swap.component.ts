import { Component, OnInit } from '@angular/core';
import { ModalService } from '@app/shared/services/modal.service';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';

import { AeroToErc20SwapService } from '@app/swap/services/aero-to-erc20-swap.service';

@Component({
  selector: 'app-load-swap',
  templateUrl: './load-swap.component.html',
  styleUrls: ['./load-swap.component.scss']
})
export class LoadSwapComponent implements OnInit {

  currentAddress: string;
  privateKey: string;

  swapId: string;

  constructor(
    private authService: AuthenticationService,
    private sessionService: SessionStorageService,
    private modalService: ModalService,
    private contractService: AeroToErc20SwapService
  ) { }

  async ngOnInit() {
    const keystore = await this.authService.showKeystore();
    this.currentAddress = "0x" + keystore.address;
    this.privateKey = this.sessionService.retrieve('private_key');
  }

  async loadSwap() {
    const swap = await this.contractService.checkSwap(this.swapId);
    console.log(swap);

    const modalResult = await this.modalService.openLoadCreateConfirm({ swapId: this.swapId });
    if(modalResult.confirmed) {
      console.log(`Confirming swap: ${this.swapId}`);
      await this.contractService.closeSwap(this.swapId);
      return;
    }

    if(modalResult.rejected) {
      console.log(`Rejecting swap: ${this.swapId}`);
      await this.contractService.expireSwap(this.swapId);
      return;
    }
  }
}
