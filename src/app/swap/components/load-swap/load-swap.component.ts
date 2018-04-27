import { Component, OnInit } from '@angular/core';
import { ModalService } from '@app/shared/services/modal.service';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';
import { NotificationService } from "@aerum/ui";

import { environment } from 'environments/environment';

import { AeroToErc20SwapService } from '@app/swap/services/aero-to-erc20-swap.service';
import { ERC20TokenService } from '@app/swap/services/erc20-token.service';

@Component({
  selector: 'app-load-swap',
  templateUrl: './load-swap.component.html',
  styleUrls: ['./load-swap.component.scss']
})
export class LoadSwapComponent implements OnInit {

  currentAddress: string;
  swapId: string;

  constructor(
    private authService: AuthenticationService,
    private sessionService: SessionStorageService,
    private modalService: ModalService,
    private contractService: AeroToErc20SwapService,
    private erc20TokenService: ERC20TokenService,
    private notificationService: NotificationService,
  ) { }

  async ngOnInit() {
    const keystore = await this.authService.showKeystore();
    this.currentAddress = "0x" + keystore.address;
  }

  async loadSwap() {
    const swap = await this.contractService.checkSwap(this.swapId);
    console.log(swap);

    const modalResult = await this.modalService.openLoadCreateConfirm({ swapId: this.swapId });
    if(modalResult.confirmed) {
      await this.confirm(swap);
      return;
    }

    if(modalResult.rejected) {
      await this.reject();
      return;
    }
  }

  private async confirm(swap: any) {
    console.log(`Approving swap: ${this.swapId}. Contract: ${swap.erc20ContractAddress}`);

    const allowanceAddress = environment.contracts.swap.address.AeroToErc20;
    const allowance = await this.erc20TokenService.allowance(swap.erc20ContractAddress, this.currentAddress, allowanceAddress);
    if (Number(allowance) < Number(swap.erc20Value)) {
      console.log(`Allowance value: ${allowance}`);
      await this.erc20TokenService.approve(swap.erc20ContractAddress, allowanceAddress, swap.erc20Value);
    }

    console.log(`Confirming swap: ${this.swapId}`);
    await this.contractService.closeSwap(this.swapId);

    this.notificationService.notify('Swap done', `Swap Id: ${this.swapId}`, "aerum");
    // TODO: if failed send allowance to 0
  }

  private async reject() {
    console.log(`Rejecting swap: ${this.swapId}`);
    await this.contractService.expireSwap(this.swapId);
    this.notificationService.notify('Swap rejected', `Swap Id: ${this.swapId}`, "aerum");
  }
}
