import { Component, OnInit } from '@angular/core';
import { Guid } from "@shared/helpers/guid";
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';
import { TokenService } from '@app/dashboard/services/token.service';
import { ModalService } from '@app/shared/services/modal.service';
import { NotificationService } from "@aerum/ui";

import { SwapToken } from './swap-tokens-list/swap-tokens-list.interfaces';
import { AeroToErc20SwapService } from '@app/swap/services/aero-to-erc20-swap.service';

@Component({
  selector: 'create-swap',
  templateUrl: './create-swap.component.html',
  styleUrls: ['./create-swap.component.scss']
})
export class CreateSwapComponent implements OnInit {

  currentAddress: string;

  swapId: string;
  token: SwapToken;
  tokenAmount: number;
  counterpartyAddress: string;
  counterpartyToken: SwapToken;
  counterpartyTokenAmount: number;
  rate: number;

  constructor(
    private authService: AuthenticationService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private contractService: AeroToErc20SwapService
  ) { }

  async ngOnInit() {
    const keystore = this.authService.getKeystore();
    this.currentAddress = "0x" + keystore.address;

    this.generateSwapId();
    this.tokenAmount = 0.01;

    // TODO: Temporary values
    this.counterpartyAddress = this.currentAddress;
    this.counterpartyTokenAmount = 10;
    this.recalculateTokenRate();
  }

  generateSwapId() {
    this.swapId = Guid.newGuid().replace(/-/g, '');
  }

  recalculateTokenRate() {
    if(!this.counterpartyTokenAmount) {
      return;
    }
    this.rate = this.tokenAmount / this.counterpartyTokenAmount;
  }

  recalculateCounterpartyTokenAmount() {
    if(!this.rate) {
      return;
    }
    this.counterpartyTokenAmount = this.tokenAmount / this.rate;
  }

  async createSwap() {
    const modalResult = await this.modalService.openSwapCreateConfirm({ swapId: this.swapId });
    if(!modalResult.confirmed) {
      console.log('Swap creation canceled');
      return;
    }

     // TODO: For now only to Aero -> Erc20 Swap
    const counterpartyTokenAmount = this.counterpartyTokenAmount * Math.pow(10, Number(this.counterpartyToken.decimals));
    console.log(counterpartyTokenAmount);

    await this.contractService.openSwap(
      this.swapId,
      this.tokenAmount.toString(10),
      counterpartyTokenAmount.toString(10),
      this.counterpartyAddress,
      this.counterpartyToken.address
    );

    // TODO: We should use events here
    this.notificationService.notify('Swap created', `Swap Id: ${this.swapId}`, "aerum");
    // TODO: Remove later
    console.log('Swap Created');
  }

  onTokenChanged(token: SwapToken) {
    console.log(token);
    this.token = token;
  }

  onCounterpartyTokenChanged(token: SwapToken) {
    console.log(token);
    this.counterpartyToken = token;
  }
}
