import { Component, OnInit } from '@angular/core';
import { Guid } from "@shared/helpers/guid";
import { AeroToErc20SwapService } from '@app/swap/services/aero-to-erc20/aero-to-erc20-swap.service';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';
import { TokenService } from '@app/dashboard/services/token.service';
import { SwapToken } from '@app/swap/components/create-swap/swap-tokens-list/swap-tokens-list.interfaces';
import { ModalService } from '@app/shared/services/modal.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'create-swap',
  templateUrl: './create-swap.component.html',
  styleUrls: ['./create-swap.component.scss']
})
export class CreateSwapComponent implements OnInit {

  currentAddress: string;
  privateKey: string;

  createSwapId: string;
  token: SwapToken;
  tokenAmount: number;
  counterpartyAddress: string;
  counterpartyToken: SwapToken;
  counterpartyTokenAmount: number;
  rate: number;

  loadSwapId: string;

  constructor(
    private authService: AuthenticationService,
    private sessionService: SessionStorageService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private contractService: AeroToErc20SwapService
  ) { }

  async ngOnInit() {
    const keystore = await this.authService.showKeystore();
    this.currentAddress = "0x" + keystore.address;
    this.privateKey = this.sessionService.retrieve('private_key');

    this.generateSwapId();
    this.tokenAmount = 0.01;

    // TODO: Temporary values
    this.counterpartyAddress = this.currentAddress;
    this.counterpartyTokenAmount = 10;
    this.recalculateTokenRate();
  }

  generateSwapId() {
    this.createSwapId = Guid.newGuid().replace(/-/g, '');
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

    const modalResult = await this.modalService.openSwapCreateConfirm({ swapId: this.createSwapId });
    if(!modalResult.confirmed) {
      console.log('Swap creation canceled');
      return;
    }

     // TODO: For now only to Aero -> Erc20 Swap
    const counterpartyTokenAmount = this.counterpartyTokenAmount * Math.pow(10, Number(this.counterpartyToken.decimals));
    console.log(counterpartyTokenAmount);

    await this.contractService.openSwap(
      this.privateKey,
      this.currentAddress,
      this.createSwapId,
      this.tokenAmount.toString(10),
      counterpartyTokenAmount.toString(10),
      this.counterpartyAddress,
      this.counterpartyToken.address
    );

    // TODO: We should use events here
    this.notificationService.showMessage(`Swap created: ${this.createSwapId}`);
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
