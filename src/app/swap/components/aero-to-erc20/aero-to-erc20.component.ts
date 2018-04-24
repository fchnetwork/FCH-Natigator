import { Component, OnInit } from '@angular/core';
import { Guid } from "@shared/helpers/guid";
import { AeroToErc20SwapService } from '@app/swap/services/aero-to-erc20/aero-to-erc20-swap.service';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-aero-to-erc20',
  templateUrl: './aero-to-erc20.component.html',
  styleUrls: ['./aero-to-erc20.component.scss']
})
export class AeroToErc20Component implements OnInit {

  currentAddress: string;
  privateKey: string;

  createSwapId: string;
  aeroAmount: number;
  traderAddress: string;
  tokenAddress: string;
  tokenAmount: number;
  tokenPrice: number;

  loadSwapId: string;

  constructor(
    private authService: AuthenticationService,
    private contractService: AeroToErc20SwapService,
    private sessionService: SessionStorageService) 
    { }

  async ngOnInit() {
    const keystore = await this.authService.showKeystore();
    this.currentAddress = "0x" + keystore.address;
    // TODO: Remove later
    console.log(`Current address: ${this.currentAddress}`);

    this.privateKey = this.sessionService.retrieve('private_key');

    this.generateSwapId();
    this.aeroAmount = 0.1;
    this.traderAddress = this.currentAddress;
    this.tokenAddress = '0x8414d0b6205d82100f694be759e40a16e31e8d40';
    this.tokenAmount = 1;
    this.tokenPrice = 10;
  }

  generateSwapId() {
    this.createSwapId = Guid.newGuid().replace(/-/g, '');
  }

  recalculateTokenPrice() {
    if(!this.aeroAmount) {
      return;
    }
    this.tokenPrice = this.tokenAmount / this.aeroAmount;
  }

  recalculateTokenAmount() {
    if(!this.tokenPrice) {
      return;
    }
    this.tokenAmount = this.aeroAmount / this.tokenPrice;
  }

  async createSwap() {
    await this.contractService.openSwap(
      this.privateKey,
      this.currentAddress,
      this.createSwapId,
      this.aeroAmount.toString(10),
      this.tokenAmount.toString(10),
      this.traderAddress,
      this.tokenAddress
    );

    // TODO: Remove later
    console.log('Swap Created');
  }

  async loadSwap() {
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
