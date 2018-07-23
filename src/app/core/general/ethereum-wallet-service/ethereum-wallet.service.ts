import { Injectable } from '@angular/core';

import Web3 from "web3";
import { environment } from "@env/environment";

import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";
import { Token } from "@core/transactions/token-service/token.model";

import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { SessionStorageService } from "ngx-webstorage";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";

@Injectable()
export class EthereumWalletService {

    private web3: Web3;

    injectedWeb3: Web3;
    injectedWeb3Name: string;
  
    isValidNetwork = false;
  
    walletTypes = EthWalletType;
    selectedWalletType = EthWalletType.Imported;
  
    storedAccounts: EthereumAccount[] = [];
  
    addresses: string[] = [];
    tokens: Token[] = [];
    address: string;
    addressQR: string;
    token: Token;
    tokenSymbol: string;
    ethBalance = 0;
    balance = 0;
  
    importInProgress = false;
    importedPrivateKey: string;
  
    importTokenInProgress = false;

constructor(
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private sessionStorageService: SessionStorageService,
    private authenticationService: AuthenticationService,
    private ethereumAuthenticationService: EthereumAuthenticationService,
    private ethereumTokenService: EthereumTokenService) 
    { 
        this.ngOnInit();
    }
    
    async ngOnInit() {
        this.initPredefinedTokens();
        await this.initPredefinedAccount();
        await this.validateNetwork();
    }

    private initPredefinedTokens() {
        this.tokens = this.ethereumTokenService.getTokens(true);
        if(this.tokens.length){
          this.token = this.tokens[0];
        }
    }

    private async initPredefinedAccount() {
        this.web3 = this.ethereumAuthenticationService.getWeb3();
        this.storedAccounts = this.sessionStorageService.retrieve('ethereum_accounts') as EthereumAccount[] || [];
        if (!this.storedAccounts.length) {
          this.generatePredefinedAccount();
        } else {
          this.onImportedWalledSelected();
        }
    
        [this.injectedWeb3, this.injectedWeb3Name] = await Promise.all([
          this.ethereumAuthenticationService.getInjectedWeb3(),
          this.ethereumAuthenticationService.getInjectedProviderName()
        ]);
    }

    private generatePredefinedAccount(): void {
        try {
          const seed = this.sessionStorageService.retrieve('seed');
          if (seed) {
            const predefinedAccount = this.ethereumAuthenticationService.generateAddressFromSeed(seed);
            this.storeAndSelectNewImportedAccount(predefinedAccount);
          }
        } catch (e) {
          this.logger.logError('Generating predefined account failed', e);
        }
    }

    private storeAndSelectNewImportedAccount(importedAccount: EthereumAccount): void {
        this.storedAccounts.push(importedAccount);
        this.addresses.push(importedAccount.address);
        this.ethereumAuthenticationService.saveEthereumAccounts(this.storedAccounts);
        this.setAddress(importedAccount.address);
    }

    private setAddress(address: string){
        this.address = address;
        this.reloadAccountData();
        this.reloadTokenData();
    }

    private reloadAccountData() {
        if (!this.address) {
          return;
        }
        this.cleanImportingData();
        this.authenticationService.createQRcode(this.address).then(qr => this.addressQR = qr);
    }

    private cleanImportingData() {
        this.importInProgress = false;
        this.importedPrivateKey = null;
    }

    private reloadTokenData() {
        if(!this.token || !this.address) {
          return;  
        }
        this.tokenSymbol = this.token.symbol;
        if (this.selectedWalletType === EthWalletType.Injected) {
          this.injectedWeb3.eth.getBalance(this.address).then((balance) => this.updateEthBalance(balance));
        } else {
          this.web3.eth.getBalance(this.address).then((balance) => this.updateEthBalance(balance));
        }
        if(this.tokenSymbol !== 'ETH') {
          this.ethereumTokenService.getBalance(this.selectedWalletType, this.token.address, this.address).then(balance => this.updateBalance(balance));
        }
    }

    private updateBalance(balance: number) {
        this.balance = balance;
    }

    private updateEthBalance(balance: number) {
        if(this.tokenSymbol === 'ETH') {
          this.balance = balance;
        }
        this.ethBalance = balance;
    }

    private onImportedWalledSelected() {
        this.addresses = this.storedAccounts.map(acc => acc.address);
        if (!this.addresses || !this.addresses.length) {
          this.setAddress(null);
        } else {
          this.setAddress(this.addresses[0]);
        }
    }

    async validateNetwork() {
        let netId = 0;
        let provider = '';
        if(this.selectedWalletType === EthWalletType.Imported){
          netId = await this.web3.eth.net.getId();
          provider = 'imported';
        }
        if(this.selectedWalletType === EthWalletType.Injected){
          netId = await this.injectedWeb3.eth.net.getId();
          provider = 'injected';
        }
        this.isValidNetwork = environment.ethereum.chainId === netId;
        if(!this.isValidNetwork) {
        this.notificationService.showMessage(`Please select Rinkeby network in your ${provider} wallet.`, 'Error');
        }
    }

}
