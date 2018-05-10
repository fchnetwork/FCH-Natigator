import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Guid } from "@shared/helpers/guid";
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';
import { TokenService } from '@app/dashboard/services/token.service';
import { ModalService } from '@app/shared/services/modal.service';
import { NotificationService } from "@aerum/ui";

import { environment } from 'environments/environment';

import { SwapToken, SwapMode } from '@app/swap/models/models';
import { AeroToErc20SwapService } from '@app/swap/services/aero-to-erc20-swap.service';
import { Erc20ToAeroSwapService } from '@app/swap/services/erc20-to-aero-swap.service';
import { Erc20ToErc20SwapService } from '@app/swap/services/erc20-to-erc20-swap.service';
import { ERC20TokenService } from '@app/swap/services/erc20-token.service';

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
  processing = false;

  constructor(
    private authService: AuthenticationService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private erc20TokenService: ERC20TokenService,
    private aeroToErc20SwapService: AeroToErc20SwapService,
    private erc20ToAeroSwapService: Erc20ToAeroSwapService,
    private erc20ToErc20SwapService: Erc20ToErc20SwapService,
    private formBuilder: FormBuilder
  ) { }

  async ngOnInit() {
    const keystore = this.authService.getKeystore();
    this.currentAddress = "0x" + keystore.address;

    this.generateSwapId();
    this.tokenAmount = 0.01;

    this.token = { symbol: 'AERO', address: '' };

    this.updateSwapMode();
    this.updateTitle();

    // TODO: We may want some other values here
    this.counterpartyAddress = this.currentAddress;
    this.counterpartyTokenAmount = 10;
    this.recalculateTokenRate();
  }

  generateSwapId() {
    const prefix = this.getSwapIdPrefix();
    const randomPart = Guid.newGuid().replace(/-/g, '').slice(prefix.length);
    this.swapId = prefix + randomPart;
  }

  recalculateTokenRate() {
    const counterpartyTokenAmount = Number(this.counterpartyTokenAmount);
    if(!counterpartyTokenAmount || counterpartyTokenAmount <= 0) {
      return;
    }
    this.rate = Number(this.tokenAmount) / counterpartyTokenAmount;
  }

  recalculateCounterpartyTokenAmount() {
    const rate = Number(this.rate);
    if(!rate || rate <= 0) {
      return;
    }
    this.counterpartyTokenAmount = Number(this.tokenAmount) / rate;
  }

  onTokenChanged(token: SwapToken) {
    const oldMode = this.mode;
    this.token = token;
    this.updateSwapMode();
    this.updateTitle();
    if(oldMode !== this.mode) {
      this.generateSwapId();
    }
  }

  onCounterpartyTokenChanged(token: SwapToken) {
    const oldMode = this.mode;
    this.counterpartyToken = token;
    this.updateSwapMode();
    this.updateTitle();
    if(oldMode !== this.mode) {
      this.generateSwapId();
    }
  }

  async createSwap() {
    const tokenAmountParsed = Number(this.tokenAmount);
    const counterpartyTokenAmountParsed = Number(this.counterpartyTokenAmount);
    const rateParsed = Number(this.rate);

    if((!tokenAmountParsed || tokenAmountParsed <= 0) ||
       (!counterpartyTokenAmountParsed || counterpartyTokenAmountParsed <= 0) ||
       (!rateParsed || rateParsed <= 0)) {
      this.notificationService.notify('Error', 'Swap ammount or rate not valid', "aerum", 3000);
      return;
    }

    if(this.mode === 'aero_to_aero') {
      this.notificationService.notify('Error', 'Aero > Aero swaps are not supported', "aerum", 3000);
      return;
    }

    // TODO: Replace with better validation
    if(!this.counterpartyToken) {
      this.notificationService.notify('Error', 'Please select counterparty token', "aerum", 3000);
      return;
    }

    try {
      this.startLoading();
      await this.confirmAndCreateSwap();
    } catch (e) {
      this.notificationService.notify('Error', 'Unknown error occured', "aerum", 3000);
      throw e;
    } finally {
      this.stopLoading();
    }
  } 

  private async confirmAndCreateSwap() {
    const modalResult = await this.modalService.openSwapCreateConfirm({ 
      swapId: this.swapId,
      token: this.token,
      tokenAmount: this.tokenAmount,
      counterpartyAddress: this.counterpartyAddress,
      counterpartyToken: this.counterpartyToken,
      counterpartyTokenAmount: this.counterpartyTokenAmount,
      rate: this.rate
    });

    if(!modalResult.confirmed) {
      console.log('Swap creation canceled');
      return;
    }

    this.notificationService.notify('Swap creation in progress...', `Swap ID: ${this.swapId}`, "aerum", 3000);
    await this.createSwapBasedOnMode();
    this.notificationService.notify('Swap created', `Swap ID: ${this.swapId}`, "aerum");
  }

  private async createSwapBasedOnMode() {
    if(this.mode === 'aero_to_erc20') {
      await this.createAeroToErc20Swap();
    } else if (this.mode === 'erc20_to_aero') {
      await this.createErc20ToAeroSwap();
    } else if (this.mode === 'erc20_to_erc20') {
      await this.createErc20ToErc20Swap();
    } else {
      throw new Error(`Unknown swap mode: ${this.mode}`);
    }
  }

  private async createAeroToErc20Swap() {
    const counterpartyTokenAmount = this.getCounterpartyTokenAmountInclusingDecimals();
    await this.aeroToErc20SwapService.openSwap(
      this.swapId,
      this.tokenAmount.toString(10),
      counterpartyTokenAmount.toString(10),
      this.counterpartyAddress,
      this.counterpartyToken.address
    );
  }

  private async createErc20ToAeroSwap() {
    const tokenAmount = this.getTokenAmountInclusingDecimals();
    await this.ensureAllowance(this.token.address, environment.contracts.swap.address.Erc20ToAero, tokenAmount);
    await this.erc20ToAeroSwapService.openSwap(
      this.swapId,
      tokenAmount.toString(10),
      this.token.address,
      this.counterpartyTokenAmount.toString(10),
      this.counterpartyAddress
    );
  }

  private async createErc20ToErc20Swap() {
    const tokenAmount = this.getTokenAmountInclusingDecimals();
    const counterpartyTokenAmount = this.getCounterpartyTokenAmountInclusingDecimals();
    await this.ensureAllowance(this.token.address, environment.contracts.swap.address.Erc20ToErc20, tokenAmount);
    await this.erc20ToErc20SwapService.openSwap(
      this.swapId,
      tokenAmount.toString(10),
      this.token.address,
      counterpartyTokenAmount.toString(10),
      this.counterpartyAddress,
      this.counterpartyToken.address
    );
  }

  private getTokenAmountInclusingDecimals() {
    return Number(this.tokenAmount) * Math.pow(10, Number(this.token.decimals));
  }

  private getCounterpartyTokenAmountInclusingDecimals() {
    return Number(this.counterpartyTokenAmount) * Math.pow(10, Number(this.counterpartyToken.decimals));
  }

  private async ensureAllowance(tokenContractAddress: string, spender: string, amount: number) {
    const allowance = await this.erc20TokenService.allowance(tokenContractAddress, this.currentAddress, spender);
    if (Number(allowance) < amount) {
      console.log(`Allowance value: ${allowance}. Needed: ${amount}`);
      await this.erc20TokenService.approve(tokenContractAddress, spender, amount.toString(10));
    }
  }

  private updateSwapMode() {
    this.mode = this.recalculateSwapMode();
  }

  private recalculateSwapMode(): SwapMode {
    if(this.isAeroInOpenSelected()) {
      if(this.isAeroInCounterpartySelected()) {
        // NOTE: not supported swap mode aero to aero
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

  private isAeroInOpenSelected() {
    return this.isAeroSelected(this.token);
  }

  private isAeroInCounterpartySelected() {
    return this.isAeroSelected(this.counterpartyToken);
  }

  private isAeroSelected(token: SwapToken) {
    return token && !token.address;
  }

  private isTokenInOpenSelected() {
    return this.isTokenSelected(this.token);
  }

  private isTokenInCounterpartySelected() {
    return this.isTokenSelected(this.counterpartyToken);
  }

  private isTokenSelected(token: SwapToken) {
    return token && token.address;
  }

  private updateTitle() {
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
      case 'aero_to_aero': {
        this.title = 'SWAP.AERO_TO_AERO';
        break;
      }
      default: {}
    }
  }

  private getSwapIdPrefix() {
    switch(this.mode) {
      case 'aero_to_erc20': return 'a2e';
      case 'erc20_to_aero': return 'e2a';
      case 'erc20_to_erc20': return 'e2e';
      case 'aero_to_aero': return 'a2a';
      default: return 'a2e';
    }
  }

  private startLoading() {
    this.processing = true;
  }

  private stopLoading() {
    this.processing = false;
  }
}
