import { Component, OnInit } from '@angular/core';

import { sha3 } from 'web3-utils';

import { Guid } from "@shared/helpers/guid";
import { AeroSwapService } from "@core/swap/cross-chain/aero-swap-service/aero-swap.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { AerumErc20SwapService } from "@core/swap/cross-chain/aerum-erc20-swap-service/aerum-erc20-swap.service";

@Component({
  selector: 'app-ethereum-wallet',
  templateUrl: './ethereum-wallet.component.html',
  styleUrls: ['./ethereum-wallet.component.scss']
})
export class EthereumWalletComponent implements OnInit {

  address: string;

  constructor(
    private logger: LoggerService,
    private authenticationService: AuthenticationService,
    private aeroSwapService: AeroSwapService,
    private aerumErc20SwapService: AerumErc20SwapService
  ) { }

  ngOnInit() {
    const keystore = this.authenticationService.getKeystore();
    this.address   = "0x" + keystore.address;
  }

  async accept() {
    await this.testAeroSwap();
    await this.testAerumErc20Swap();
  }

  async testAeroSwap() {
    const secret = Guid.newGuid();
    const hash = sha3(secret);
    const aero = '0.01';
    const timeout = 120;
    const timestamp = Math.ceil((new Date().getTime() / 1000) + timeout);

    this.logger.logMessage(`Secret: ${secret}, hash: ${hash}, timestamp: ${timestamp}, trader: ${this.address}`);
    await this.aeroSwapService.openSwap(hash, aero, this.address, timestamp);
    this.logger.logMessage(`Swap created: ${hash}`);
    const swap = await this.aeroSwapService.checkSwap(hash);
    this.logger.logMessage(`Swap checked: ${hash}`, swap);
  }

  async testAerumErc20Swap() {
    const secret = Guid.newGuid();
    const hash = sha3(secret);
    const amount = (10 * Math.pow(10,18)).toString(10);
    const tokenAddress = '';
    const timeout = 120;
    const timestamp = Math.ceil((new Date().getTime() / 1000) + timeout);

    this.logger.logMessage(`Secret: ${secret}, hash: ${hash}, timestamp: ${timestamp}, trader: ${this.address}, token: ${tokenAddress}`);
    await this.aerumErc20SwapService.openSwap(hash, amount, tokenAddress, this.address, timestamp);
    this.logger.logMessage(`Swap created: ${hash}`);
    const swap = await this.aeroSwapService.checkSwap(hash);
    this.logger.logMessage(`Swap checked: ${hash}`, swap);
  }

  dismiss() {}

}
