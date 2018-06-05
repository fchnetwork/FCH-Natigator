import { Component, OnInit } from '@angular/core';

import { sha3 } from 'web3-utils';

import { Guid } from "@shared/helpers/guid";
import { Chain } from "@core/swap/cross-chain/swap-template-service/chain.enum";
import { AeroSwapService } from "@core/swap/cross-chain/aero-swap-service/aero-swap.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { AerumErc20SwapService } from "@core/swap/cross-chain/aerum-erc20-swap-service/aerum-erc20-swap.service";
import { SwapTemplateService } from "@core/swap/cross-chain/swap-template-service/swap-template.service";
import { EtherSwapService } from "@core/swap/cross-chain/ether-swap-service/ether-swap.service";
import { EthWalletService } from "@core/ethereum/eth-wallet-service/eth-wallet.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { SelfSignedEthereumContractExecutorService } from "@core/ethereum/self-signed-ethereum-contract-executor-service/self-signed-ethereum-contract-executor.service";

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
    private aerumErc20SwapService: AerumErc20SwapService,
    private swapTemplateService: SwapTemplateService,
    private etherSwapService: EtherSwapService,
    private ethWalletService: EthWalletService,
    private ethereumAuthService: EthereumAuthenticationService,
    private injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService,
    private selfSignedEthereumContractExecutorService: SelfSignedEthereumContractExecutorService
  ) { }

  ngOnInit() {
    const keystore = this.authenticationService.getKeystore();
    this.address   = "0x" + keystore.address;
  }

  async accept() {
    // await this.testAeroSwap();
    // await this.testAerumErc20Swap();
    // await this.testSwapTemplate();
    await this.testSwapTemplates();
    // await this.testEthereumSwap();
    await this.testEthereumInjectedSwap();
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

  async testSwapTemplate() {
    const id =  Guid.newGuid().replace(/-/g, '');
    this.logger.logMessage(`Template: ${id}`);
    await this.swapTemplateService.registerTemplate(id, '0x0', this.address, '0x0', this.address, 0.01, Chain.Aerum);
    this.logger.logMessage(`Template created: ${id}`);
    const template = await this.swapTemplateService.getTemplateById(id);
    this.logger.logMessage(`Template loaded: ${id}`, template);
  }

  async testSwapTemplates() {
    const templates = await this.swapTemplateService.getTemplates(Chain.Aerum);
    this.logger.logMessage(`Templates loaded:`, templates);

    const templatesById = await this.swapTemplateService.getTemplatesByAsset('0x0', Chain.Aerum);
    this.logger.logMessage(`Templates by id loaded:`, templatesById);

    const templatesById2 = await this.swapTemplateService.getTemplatesByAsset('0x0', Chain.Ethereum);
    this.logger.logMessage(`Templates by id loaded:`, templatesById2);
  }

  async testEthereumSwap() {
    const secret = Guid.newGuid();
    const hash = sha3(secret);
    const aero = '0.01';
    const timeout = 120;
    const timestamp = Math.ceil((new Date().getTime() / 1000) + timeout);

    const withdrawTrader = "0xF38eDC62732c418EE18bEbf89CC063B3D1b57e0C";
    this.logger.logMessage(`Secret: ${secret}, hash: ${hash}, timestamp: ${timestamp}, trader: ${withdrawTrader}`);

    const rinkebyWeb3 = await this.ethereumAuthService.getWeb3();
    const privateKey = await this.ethWalletService.getPrivateKey();
    const sender = await this.ethWalletService.getAddress();
    this.selfSignedEthereumContractExecutorService.init(rinkebyWeb3, sender, privateKey);
    this.etherSwapService.useContractExecutor(this.selfSignedEthereumContractExecutorService);

    // TODO: Unsubscribe
    this.etherSwapService.onOpen(hash, (err, event) => {
      if(err) {
        this.logger.logError(`Create swap error: ${hash}`, err);
      } else {
        this.logger.logMessage(`Create swap success: ${hash}`, event);
      }
    });

    const cost = await this.etherSwapService.estimateOpenSwap(hash, aero, withdrawTrader, timestamp);
    this.logger.logMessage(`Swap cost: ${hash}`, cost);
    await this.etherSwapService.openSwap(hash, aero, withdrawTrader, timestamp);
    this.logger.logMessage(`Swap created: ${hash}`);
    const swap = await this.etherSwapService.checkSwap(hash);
    this.logger.logMessage(`Swap checked: ${hash}`, swap);
  }

  async testEthereumInjectedSwap() {
    const secret = Guid.newGuid();
    const hash = sha3(secret);
    const aero = '0.01';
    const timeout = 120;
    const timestamp = Math.ceil((new Date().getTime() / 1000) + timeout);

    const withdrawTrader = "0xF38eDC62732c418EE18bEbf89CC063B3D1b57e0C";
    this.logger.logMessage(`Secret: ${secret}, hash: ${hash}, timestamp: ${timestamp}, trader: ${withdrawTrader}`);

    const injectedWeb3 = await this.ethereumAuthService.getInjectedWeb3();
    const accounts = await injectedWeb3.eth.getAccounts();
    const sender = accounts[0];
    this.injectedWeb3ContractExecutorService.init(injectedWeb3, sender);
    this.etherSwapService.useContractExecutor(this.injectedWeb3ContractExecutorService);

    // TODO: Unsubscribe
    this.etherSwapService.onOpen(hash, (err, event) => {
      if(err) {
        this.logger.logError(`Create swap error: ${hash}`, err);
      } else {
        this.logger.logMessage(`Create swap success: ${hash}`, event);
      }
    });

    const cost = await this.etherSwapService.estimateOpenSwap(hash, aero, withdrawTrader, timestamp);
    this.logger.logMessage(`Swap cost: ${hash}`, cost);
    await this.etherSwapService.openSwap(hash, aero, withdrawTrader, timestamp);
    this.logger.logMessage(`Swap created: ${hash}`);
    const swap = await this.etherSwapService.checkSwap(hash);
    this.logger.logMessage(`Swap checked: ${hash}`, swap);
  }

  dismiss() {}

}
