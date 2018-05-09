import { Component, OnInit } from '@angular/core';
import { ModalService } from '@app/shared/services/modal.service';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { NotificationService } from "@aerum/ui";

import { environment } from 'environments/environment'; 

import Web3 from 'web3';
import { TransactionReceipt } from 'web3/types';
import { SwapMode, LoadedSwap, SwapStatus } from '@app/wallet/swap/models/models';
import { AeroToErc20SwapService } from '@app/wallet/swap/services/aero-to-erc20-swap.service';
import { Erc20ToAeroSwapService } from '@app/wallet/swap/services/erc20-to-aero-swap.service';
import { Erc20ToErc20SwapService } from '@app/wallet/swap/services/erc20-to-erc20-swap.service';
import { ERC20TokenService } from '@app/wallet/swap/services/erc20-token.service';
import { TokenService } from '@app/wallet/dashboard/services/token.service';

interface SwapCommonOperationsService {
  expireSwap(swapId: string) : Promise<TransactionReceipt>;
  checkSwap(swapId: string) : Promise<any>;
}

@Component({
  selector: 'app-load-swap',
  templateUrl: './load-swap.component.html',
  styleUrls: ['./load-swap.component.scss']
})
export class LoadSwapComponent implements OnInit {

  private web3: Web3;

  currentAddress: string;
  swapId: string;
  title: string;
  mode: SwapMode | 'unknown';
  processing = false;

  constructor(
    private authService: AuthenticationService,
    private modalService: ModalService,
    private aeroToErc20SwapService: AeroToErc20SwapService,
    private erc20ToAeroSwapService: Erc20ToAeroSwapService,
    private erc20ToErc20SwapService: Erc20ToErc20SwapService,
    private erc20TokenService: ERC20TokenService,
    private notificationService: NotificationService,
    private tokenService: TokenService
  ) {
    this.web3 = this.authService.initWeb3();
  }

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
    if(!this.swapId) {
      console.log('Swap ID empty');
      return;
    }

    if(this.processing) {
      console.log('Other operation in progress');
      return;
    }

    try{
      this.startLoading();
      await this.showSwapInModalAndProcess();
    } catch(e) {
      this.notificationService.notify('Error', 'Swap not found or invalid', "aerum", 3000);
      throw e;
    } 
    finally {
      this.stopLoading();
    }
  }

  private async showSwapInModalAndProcess() {
    const swapService = this.getCurrentSwapService();
    const swap = await swapService.checkSwap(this.swapId);
    console.log(swap);

    const status = this.mapSwapStatus(swap.state);
    if(status === 'Invalid') {
      throw new Error(`Swap wit ID ${this.swapId} not found or invalid`);
    }

    const loadedSwap = await this.mapToLoadedSwap(this.swapId, swap);
    console.log(loadedSwap);

    const modalResult = await this.modalService.openLoadCreateConfirm(loadedSwap);
    if(modalResult.confirmed) {
      this.notificationService.notify('Swap completion in progress...', `Swap ID: ${this.swapId}`, "aerum", 3000);
      await this.confirm(loadedSwap);
      this.notificationService.notify('Swap done', `Swap ID: ${this.swapId}`, "aerum");
    } else if(modalResult.rejected) {
      this.notificationService.notify('Swap rejection in progress...', `Swap ID: ${this.swapId}`, "aerum", 3000);
      await this.reject();
      this.notificationService.notify('Swap rejected', `Swap ID: ${this.swapId}`, "aerum");
    }
  }

  private async confirm(swap: LoadedSwap) {
    console.log(`Confirming swap: ${this.swapId}`);
    if(this.mode === 'aero_to_erc20') {
      await this.confirmAeroToErc20Swap(swap);
    } else if(this.mode === 'erc20_to_erc20') {
      await this.confirmErc20ToErc20Swap(swap);
    } else if(this.mode === 'erc20_to_aero') {
      await this.confirmErc20ToAeroSwap(swap);
    }
  }

  private async confirmAeroToErc20Swap(swap: LoadedSwap) {
    await this.ensureAllowance(
      swap.counterpartyTokenAddress,
      environment.contracts.swap.address.AeroToErc20,
      Number(swap.counterpartyAmount)
    );
    await this.aeroToErc20SwapService.closeSwap(this.swapId);
  }

  private async confirmErc20ToErc20Swap(swap: LoadedSwap) { 
    await this.ensureAllowance(
      swap.counterpartyTokenAddress,
      environment.contracts.swap.address.Erc20ToErc20,
      Number(swap.counterpartyAmount)
    );
    await this.erc20ToErc20SwapService.closeSwap(this.swapId);
  }

  private async confirmErc20ToAeroSwap(swap: LoadedSwap) { 
    const closeEtherAmount = this.web3.utils.fromWei(swap.counterpartyAmount, 'ether');
    await this.erc20ToAeroSwapService.closeSwap(this.swapId, closeEtherAmount);
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

  private getCurrentSwapService() : SwapCommonOperationsService {
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

  private async mapToLoadedSwap(swapId: string, swap: any) : Promise<LoadedSwap> {
    if(this.mode === 'aero_to_erc20') {
      return await this.mapToLoadedSwapFromAeroToErc20Swap(swapId, swap);
    } else if (this.mode === 'erc20_to_aero') {
      return await this.mapToLoadedSwapFromErc20ToAeroSwap(swapId, swap);
    } else if (this.mode === 'erc20_to_erc20') {
      return await this.mapToLoadedSwapFromErc20ToErc20Swap(swapId, swap);
    } else {
      throw new Error(`Not supported swap mode: ${this.mode}`);
    }
  }

  private async mapToLoadedSwapFromAeroToErc20Swap(swapId: string, swap: any) {
    const counterpartyTokenInfo: any = await this.tokenService.getTokensInfo(swap.erc20ContractAddress);
    return {
      swapId,
      tokenAmount: swap.ethValue,
      tokenAmountFormated: this.web3.utils.fromWei(swap.ethValue, 'ether'),
      tokenTrader: swap.ethTrader,
      tokenAddress: '',
      counterpartyAmount: swap.erc20Value,
      counterpartyAmountFormated: this.getDecimalTokenValue(swap.erc20Value, counterpartyTokenInfo.decimals),
      counterpartyTrader: swap.erc20Trader,
      counterpartyTokenAddress: swap.erc20ContractAddress,
      counterpartyTokenInfo,
      status: this.mapSwapStatus(swap.state)
    };
  }

  private async mapToLoadedSwapFromErc20ToAeroSwap(swapId: string, swap: any) {
    const tokenInfo: any = await this.tokenService.getTokensInfo(swap.erc20ContractAddress);
    return {
      swapId,
      tokenAmount: swap.erc20Value,
      tokenAmountFormated: this.getDecimalTokenValue(swap.erc20Value, tokenInfo.decimals),
      tokenTrader: swap.erc20Trader,
      tokenAddress: swap.erc20ContractAddress,
      tokenInfo,
      counterpartyAmount: swap.ethValue,
      counterpartyAmountFormated: this.web3.utils.fromWei(swap.ethValue, 'ether'),
      counterpartyTrader: swap.ethTrader,
      counterpartyTokenAddress: '',
      status: this.mapSwapStatus(swap.state)
    };
  }

  private async mapToLoadedSwapFromErc20ToErc20Swap(swapId: string, swap: any) {
    const tokenInfo: any = await this.tokenService.getTokensInfo(swap.openContractAddress);
    const counterpartyTokenInfo: any = await this.tokenService.getTokensInfo(swap.closeContractAddress);
    return {
      swapId,
      tokenAmount: swap.openValue,
      tokenAmountFormated: this.getDecimalTokenValue(swap.openValue, tokenInfo.decimals),
      tokenTrader: swap.openTrader,
      tokenAddress: swap.openContractAddress,
      tokenInfo,
      counterpartyAmount: swap.closeValue,
      counterpartyAmountFormated: this.getDecimalTokenValue(swap.closeValue, counterpartyTokenInfo.decimals),
      counterpartyTrader: swap.closeTrader,
      counterpartyTokenAddress: swap.closeContractAddress,
      counterpartyTokenInfo,
      status: this.mapSwapStatus(swap.state)
    };
  }

  private getDecimalTokenValue(value: number, decimals: number) {
    return value / Math.pow(10, Number(decimals));
  }

  private mapSwapStatus(status: string) : SwapStatus {
    switch(status) {
      case '1': return 'Open';
      case '2': return 'Closed';
      case '3': return 'Expired';
      default: return 'Invalid';
    }
  }

  private startLoading() {
    this.processing = true;
  }

  private stopLoading() {
    this.processing = false;
  }
}
