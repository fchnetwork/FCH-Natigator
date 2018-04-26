import { Component, OnInit } from '@angular/core';
import { ModalService } from '@app/shared/services/modal.service';
import { AeroToErc20SwapService } from '@app/swap/services/aero-to-erc20/aero-to-erc20-swap.service';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-load-swap',
  templateUrl: './load-swap.component.html',
  styleUrls: ['./load-swap.component.scss']
})
export class LoadSwapComponent implements OnInit {

  currentAddress: string;
  privateKey: string;

  loadSwapId: string;

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
    // this.modalService.openLoadCreateConfirm();

    const swap = await this.contractService.checkSwap(
      this.privateKey,
      this.currentAddress,
      this.loadSwapId
    );

    // TODO: Remove later
    console.log('Swap Loaded');
  }

  async cancelSwap() {
    await this.contractService.expireSwap(
      this.privateKey,
      this.currentAddress,
      this.loadSwapId
    );

    // TODO: Remove later
    console.log('Swap Canceled');
  }
}
