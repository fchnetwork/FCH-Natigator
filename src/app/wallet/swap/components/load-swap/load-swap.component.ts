import { Component, OnInit } from '@angular/core';
import { NotificationService } from "@aerum/ui";

import { environment } from '@env/environment';

import { fromWei } from 'web3-utils';

import { TransactionReceipt } from 'web3/types';
import { SwapMode, LoadedSwap, SwapStatus } from '@swap/models/models';
import { LoggerService } from "@core/general/logger-service/logger.service";
import { AuthenticationService } from '@core/authentication/authentication-service/authentication.service';
import { AeroToErc20SwapService } from '@core/swap/on-chain/aero-to-erc20-swap-service/aero-to-erc20-swap.service';
import { Erc20ToAeroSwapService } from '@core/swap/on-chain/erc20-to-aero-swap-service/erc20-to-aero-swap.service';
import { Erc20ToErc20SwapService } from '@core/swap/on-chain/erc20-to-erc20-swap-service/erc20-to-erc20-swap.service';
import { ERC20TokenService } from '@core/swap/on-chain/erc20-token-service/erc20-token.service';
import { ModalService } from '@core/general/modal-service/modal.service';
import { TokenService } from '@core/transactions/token-service/token.service';
import { SessionStorageService } from 'ngx-webstorage';

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

  currentAddress: string;
  swapId: string;
  title: string;
  mode: SwapMode | 'unknown';
  processing = false;

  constructor(
    private logger: LoggerService,
    private authService: AuthenticationService,
    private modalService: ModalService,
    private aeroToErc20SwapService: AeroToErc20SwapService,
    private erc20ToAeroSwapService: Erc20ToAeroSwapService,
    private erc20ToErc20SwapService: Erc20ToErc20SwapService,
    private erc20TokenService: ERC20TokenService,
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private sessionStorageService: SessionStorageService,
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
    if(!this.swapId) {
      this.logger.logMessage('Swap ID empty');
      return;
    }

    if(this.processing) {
      this.logger.logMessage('Other operation in progress');
      return;
    }

    try{
      this.startLoading();
      await this.showSwapInModalAndProcess();
    } catch(e) {
      this.notificationService.notify('Error', 'Swap not found or invalid', "aerum", 3000);
      this.logger.logError('Swap action error:', e);
    }
    finally {
      this.stopLoading();
    }
  }

  private async showSwapInModalAndProcess() {
    const swapService = this.getCurrentSwapService();
    const swap = await swapService.checkSwap(this.swapId);
    this.logger.logMessage('Original swap:', swap);

    const status = this.mapSwapStatus(swap.state);
    if(status === 'Invalid') {
      throw new Error(`Swap wit ID ${this.swapId} not found or invalid`);
    }

    const loadedSwap = await this.mapToLoadedSwap(this.swapId, swap);
    this.logger.logMessage('Mapped swap:', loadedSwap);

    const modalResult = await this.modalService.openSwapLoadConfirm(loadedSwap);
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
    this.logger.logMessage(`Confirming swap: ${this.swapId}`);
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
    const closeEtherAmount = fromWei(swap.counterpartyAmount, 'ether');
    await this.erc20ToAeroSwapService.closeSwap(this.swapId, closeEtherAmount);
  }

  private async ensureAllowance(tokenContractAddress: string, spender: string, amount: number) {
    const allowance = await this.erc20TokenService.allowance(tokenContractAddress, this.currentAddress, spender);
    if (Number(allowance) < amount) {
      this.logger.logMessage(`Allowance value: ${allowance}. Needed: ${amount}`);
      await this.erc20TokenService.approve(tokenContractAddress, spender, amount.toString(10));
    }
  }

  private async reject() {
    this.logger.logMessage(`Rejecting swap: ${this.swapId}`);
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

  private async mapToLoadedSwapFromAeroToErc20Swap(swapId: string, swap: any) : Promise<LoadedSwap> {
    const counterpartyTokenInfo: any = this.getTokensInfo(swap.erc20ContractAddress);
    return {
      swapId,
      tokenAmount: swap.ethValue,
      tokenAmountFormatted: fromWei(swap.ethValue, 'ether'),
      tokenTrader: swap.ethTrader,
      tokenAddress: '',
      counterpartyAmount: swap.erc20Value,
      counterpartyAmountFormatted: this.getDecimalTokenValue(swap.erc20Value, counterpartyTokenInfo.decimals, swap.erc20ContractAddress),
      counterpartyTrader: swap.erc20Trader,
      counterpartyTokenAddress: swap.erc20ContractAddress,
      counterpartyTokenInfo,
      status: this.mapSwapStatus(swap.state)
    };
  }

  private async mapToLoadedSwapFromErc20ToAeroSwap(swapId: string, swap: any) : Promise<LoadedSwap> {
    const tokenInfo: any = this.getTokensInfo(swap.erc20ContractAddress);
    return {
      swapId,
      tokenAmount: swap.erc20Value,
      tokenAmountFormatted: this.getDecimalTokenValue(swap.erc20Value, tokenInfo.decimals, swap.erc20ContractAddress),
      tokenTrader: swap.erc20Trader,
      tokenAddress: swap.erc20ContractAddress,
      tokenInfo,
      counterpartyAmount: swap.ethValue,
      counterpartyAmountFormatted: fromWei(swap.ethValue, 'ether'),
      counterpartyTrader: swap.ethTrader,
      counterpartyTokenAddress: '',
      status: this.mapSwapStatus(swap.state)
    };
  }

  private async mapToLoadedSwapFromErc20ToErc20Swap(swapId: string, swap: any) : Promise<LoadedSwap> {
    const tokenInfo: any = this.getTokensInfo(swap.openContractAddress);
    const counterpartyTokenInfo: any = this.getTokensInfo(swap.closeContractAddress);
    return {
      swapId,
      tokenAmount: swap.openValue,
      tokenAmountFormatted: this.getDecimalTokenValue(swap.openValue, tokenInfo.decimals, swap.openContractAddress),
      tokenTrader: swap.openTrader,
      tokenAddress: swap.openContractAddress,
      tokenInfo,
      counterpartyAmount: swap.closeValue,
      counterpartyAmountFormatted: this.getDecimalTokenValue(swap.closeValue, counterpartyTokenInfo.decimals, swap.closeContractAddress),
      counterpartyTrader: swap.closeTrader,
      counterpartyTokenAddress: swap.closeContractAddress,
      counterpartyTokenInfo,
      status: this.mapSwapStatus(swap.state)
    };
  }

  getTokensInfo(address) {
    const tokens = this.sessionStorageService.retrieve('tokens');
    const token = tokens.find((item)=>{
      return item.address.toLowerCase() === address.toLowerCase();
    });
    return token;
  }

  private getDecimalTokenValue(value: number, decimals: number, address) {
    if(!decimals) {
      const token = this.getTokensInfo(address);
      if(token) {
        decimals = token.decimals;
      }
    }
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
