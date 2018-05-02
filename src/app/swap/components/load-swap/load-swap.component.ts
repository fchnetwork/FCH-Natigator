import { Component, OnInit } from '@angular/core';
import { ModalService } from '@app/shared/services/modal.service';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';
import { NotificationService } from "@aerum/ui";

import { environment } from 'environments/environment';

import { AeroToErc20SwapService } from '@app/swap/services/aero-to-erc20-swap.service';
import { ERC20TokenService } from '@app/swap/services/erc20-token.service';
import { Erc20ToAeroSwapService } from '@app/swap/services/erc20-to-aero-swap.service';
import { Erc20ToErc20SwapService } from '@app/swap/services/erc20-to-erc20-swap.service';
import { SwapMode, SwapManager, LoadedSwap, SwapStatus } from '@app/swap/swap.models';

@Component({
  selector: 'app-load-swap',
  templateUrl: './load-swap.component.html',
  styleUrls: ['./load-swap.component.scss']
})
export class LoadSwapComponent implements OnInit {

  currentAddress: string;
  swapId: string;

  title: string;

  mode: SwapMode | 'unknown';

  constructor(
    private authService: AuthenticationService,
    private sessionService: SessionStorageService,
    private modalService: ModalService,
    private aeroToErc20SwapService: AeroToErc20SwapService,
    private erc20ToAeroSwapService: Erc20ToAeroSwapService,
    private erc20ToErc20SwapService: Erc20ToErc20SwapService,
    private erc20TokenService: ERC20TokenService,
    private notificationService: NotificationService
  ) { }

  async ngOnInit() {
    const keystore = await this.authService.showKeystore();
    this.currentAddress = "0x" + keystore.address;

    this.mode = 'aero_to_erc20';
    this.updateTitle();
  }

  onSwapIdChange() {
    this.updateSwapMode();
    this.updateTitle();
  }

  async loadSwap() {
    const swapService = this.getCurrentSwapService();
    const swap = await swapService.checkSwap(this.swapId);
    console.log(swap);

    const status = this.convertSwapStatus(swap.state);
    if(status === 'Invalid') {
      this.notificationService.notify('Error', 'Swap not found or invalid', "aerum", 3000);
      return;
    }

    const loadedSwap = this.convertToLoadedSwap(this.swapId, swap);
    console.log(loadedSwap);

    const modalResult = await this.modalService.openLoadCreateConfirm(loadedSwap);
    if(modalResult.confirmed) {
      await this.confirm(loadedSwap);
      return;
    }

    if(modalResult.rejected) {
      await this.reject();
      return;
    }
  }

  private async confirm(swap: LoadedSwap) {
    console.log(`Approving swap: ${this.swapId}`);

    if(this.mode === 'aero_to_erc20') {
      await this.ensureAllowance(
        swap.counterpartyTokenAddress,
        environment.contracts.swap.address.AeroToErc20,
        Number(swap.counterpartyAmount)
      );
    }

    if(this.mode === 'erc20_to_erc20') {
      await this.ensureAllowance(
        swap.counterpartyTokenAddress,
        environment.contracts.swap.address.Erc20ToAero,
        Number(swap.counterpartyAmount)
      );
    }

    console.log(`Confirming swap: ${this.swapId}`);
    const swapService = this.getCurrentSwapService();
    await swapService.closeSwap(this.swapId);

    this.notificationService.notify('Swap done', `Swap Id: ${this.swapId}`, "aerum");
    // TODO: if failed send allowance to 0
  }

  private async ensureAllowance(tokenContractAddress: string, spender: string, amount: number) {
    const allowance = await this.erc20TokenService.allowance(tokenContractAddress, this.currentAddress, spender);
    if (Number(allowance) < amount) {
      console.log(`Allowance value: ${allowance}. Needed: ${amount}`);
      await this.erc20TokenService.approve(tokenContractAddress, spender, amount.toString(10));
    }
  }

  private async reject() {
    console.log(`Rejecting swap: ${this.swapId}`);

    const swapService = this.getCurrentSwapService();
    await swapService.expireSwap(this.swapId);
    
    this.notificationService.notify('Swap rejected', `Swap Id: ${this.swapId}`, "aerum");
  }

  private updateSwapMode() {
    this.mode = this.getSwapModel();
  }

  private getSwapModel() : SwapMode | 'unknown' {
    const prefixLength = 3;
    if(!this.swapId || this.swapId.length <= prefixLength) {
      return 'unknown';
    }

    const swapPrefix = this.swapId.slice(0, prefixLength);
    switch(swapPrefix) {
      case 'a2e': return 'aero_to_erc20';
      case 'e2a': return 'erc20_to_aero';
      case 'e2e': return 'erc20_to_erc20';
      case 'a2a': return 'aero_to_aero';
      default: return 'unknown';
    }
  }

  private getCurrentSwapService() : SwapManager {
    switch(this.mode) {
      case 'aero_to_erc20': return this.aeroToErc20SwapService;
      case 'erc20_to_aero': return this.erc20ToAeroSwapService;
      case 'erc20_to_erc20': return this.erc20ToErc20SwapService;
      default: throw new Error('Swap type is not supported');
    }
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

  private convertToLoadedSwap(swapId: string, swap: any) : LoadedSwap {
    if(this.mode === 'aero_to_erc20') {
      return {
        swapId,
        tokenAmount: swap.ethValue,
        tokenTrader: swap.ethTrader,
        tokenAddress: '',
        counterpartyAmount: swap.erc20Value,
        counterpartyTrader: swap.erc20Trader,
        counterpartyTokenAddress: swap.erc20ContractAddress,
        status: this.convertSwapStatus(swap.state)
      };
    } else if (this.mode === 'erc20_to_aero') {
      return {
        swapId,
        tokenAmount: swap.erc20Value,
        tokenTrader: swap.erc20Trader,
        tokenAddress: swap.erc20ContractAddress,
        counterpartyAmount: swap.ethValue,
        counterpartyTrader: swap.ethTrader,
        counterpartyTokenAddress: '',
        status: this.convertSwapStatus(swap.state)
      };
    } else if (this.mode === 'erc20_to_erc20') {
      return {
        swapId,
        tokenAmount: swap.openValue,
        tokenTrader: swap.openTrader,
        tokenAddress: swap.openContractAddress,
        counterpartyAmount: swap.closeValue,
        counterpartyTrader: swap.closeTrader,
        counterpartyTokenAddress: swap.closeContractAddress,
        status: this.convertSwapStatus(swap.state)
      };
    } else {
      throw new Error('Unknow swap mode');
    }
  }

  private convertSwapStatus(status: string) : SwapStatus {
    switch(status) {
      case '1': return 'Open';
      case '2': return 'Closed';
      case '3': return 'Expired';
      default: return 'Invalid';
    }
  }
}
