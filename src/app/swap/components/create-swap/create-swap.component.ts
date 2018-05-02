import { Component, OnInit } from '@angular/core';
import { Guid } from "@shared/helpers/guid";
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';
import { TokenService } from '@app/dashboard/services/token.service';
import { ModalService } from '@app/shared/services/modal.service';
import { NotificationService } from "@aerum/ui";

import { AeroToErc20SwapService } from '@app/swap/services/aero-to-erc20-swap.service';
import { SwapToken, SwapMode } from '@app/swap/swap.models';

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

  mode: SwapMode;
  title: string;

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

    this.token = { symbol: 'AERO', address: '' };

    this.updateSwapMode();
    this.updateTitle();

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
    this.updateSwapMode();
    this.updateTitle();
  }

  onCounterpartyTokenChanged(token: SwapToken) {
    console.log(token);
    this.counterpartyToken = token;
    this.updateSwapMode();
    this.updateTitle();
  }

  updateSwapMode() {
    this.mode = this.recalculateSwapMode();
  }

  recalculateSwapMode(): SwapMode {
    if(this.isAeroInOpenSelected()) {
      if(this.isAeroInCounterpartySelected()) {
        // NOTE: NOT supported swap mode aero to aero
        return 'aero_to_aero';
      } else {
        return 'aero_to_erc20';
      }
    } else {
      if(this.isAeroInCounterpartySelected()) {
        return 'erc20_to_aero';
      } else {
        return 'erc20_to_erc20';
      }
    }
  }

  isAeroInOpenSelected() {
    return this.isAeroSelected(this.token);
  }

  isAeroInCounterpartySelected() {
    return this.isAeroSelected(this.counterpartyToken);
  }

  isAeroSelected(token: SwapToken) {
    return token && !token.address;
  }

  isTokenInOpenSelected() {
    return this.isTokenSelected(this.token);
  }

  isTokenInCounterpartySelected() {
    return this.isTokenSelected(this.counterpartyToken);
  }

  isTokenSelected(token: SwapToken) {
    return token && token.address;
  }

  updateTitle() {
    switch(this.mode) {
      case 'aero_to_erc20': {
        this.title = 'SWAP.AERO_TO_TOKEN';
        break;
      }
      case 'erc20_to_aero': {
        this.title = 'SWAP.TOKEN_TO_AERO';
        break;
      }
      case 'erc20_to_erc20': {
        this.title = 'SWAP.TOKEN_TO_TOKEN';
        break;
      }
      default: {}
    }
  }
}
