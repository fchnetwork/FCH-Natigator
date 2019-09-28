import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import Web3 from "web3";
import { TranslateService } from '@ngx-translate/core';
import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { InjectedWeb3Error } from "@external/models/injected-web3.error";
import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";
import { Token } from "@core/transactions/token-service/token.model";

import { SessionStorageService } from "ngx-webstorage";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";

@Component({
  selector: 'app-settings-ethereum-wallet',
  templateUrl: './settings-ethereum-wallet.component.html',
  styleUrls: ['./settings-ethereum-wallet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsEthereumWalletComponent implements OnInit {

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
    private ethereumTokenService: EthereumTokenService,
    private translateService: TranslateService,
    private environment: EnvironmentService
  ) {
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
    this.isValidNetwork = this.environment.get().ethereum.chainId === netId;
    if(!this.isValidNetwork) {
    this.notificationService.showMessage(`${this.translateService.instant('EXTERNAL-SWAP.WALLET.PLEASE_SELECT_RINKEBY_NETWORK_IN_YOUR')} ${provider} ${this.translateService.instant('EXTERNAL-SWAP.WALLET.WALLET_')}`, this.translateService.instant('ERROR'));
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

  private setAddress(address: string){
    this.address = address;
    this.reloadAccountData();
    this.reloadTokenData();
  }

  async onWalletSelect(event: { value: EthWalletType }) {
    try {
      this.selectedWalletType = event.value;
      if (this.selectedWalletType === EthWalletType.Injected) {
        await this.onInjectedWalletSelected();
      } else {
        this.onImportedWalledSelected();
      }
      await this.validateNetwork();
    } catch (e) {
      this.logger.logError('Error while selecting ethereum account provider', e);
      this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.WALLET.UNHANDLED_ERROR_OCCURRED'), this.translateService.instant('ERROR'));
    }
  }

  private async onInjectedWalletSelected() {
    try {
      await this.ethereumAuthenticationService.ensureEthereumEnabled();
    } catch (error) {
      this.notificationService.showMessage(this.translateService.instant('BASE_CONTRACT.CANNOT_LOAD_ACCOUNT'), this.translateService.instant('ERROR'));
      throw new InjectedWeb3Error(this.translateService.instant('BASE_CONTRACT.CANNOT_LOAD_ACCOUNT'));
    }
    const accounts = await this.injectedWeb3.eth.getAccounts();
    if (!accounts || !accounts.length) {
      this.addresses = [];
      this.setAddress(null);
      this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.WALLET.PLEASE_LOGIN_IN_MIST__METAMASK'), this.translateService.instant('EXTERNAL-SWAP.WALLET.CANNOT_GET_ACCOUNTS_FROM_WALLET'));
    } else {
      this.addresses = accounts;
      this.setAddress(accounts[0]);
    }
  }

  private onImportedWalledSelected() {
    this.addresses = this.storedAccounts.map(acc => acc.address);
    if (!this.addresses || !this.addresses.length) {
      this.setAddress(null);
    } else {
      this.setAddress(this.addresses[0]);
    }
  }

  onTokenAdded(token: Token) {
    this.importTokenInProgress = false;
    this.token = token;
    this.tokens = this.ethereumTokenService.getTokens(true);
    this.reloadTokenData();
  }

  onAddressChange() {
    // NOTE: If address is empty we import new one
    if (this.address) {
      this.reloadAccountData();
      this.reloadTokenData();
    } else {
      this.importInProgress = true;
      this.setAddress(null);
    }
  }

  onTokenChange() {
    // NOTE: If token is empty we import new one
    if (this.token) {
      this.importTokenInProgress = false;
      this.reloadTokenData();
    } else {
      this.importTokenInProgress = true;
      this.token = null;
    }
  }

  import() {
    if (this.importedPrivateKey) {
      if (!this.importedPrivateKey.startsWith('0x')) {
        this.importedPrivateKey = "0x" + this.importedPrivateKey;
      }

      const importedAddress = this.authenticationService.generateAddressFromPrivateKey(this.importedPrivateKey);
      if (this.isAlreadyImported(importedAddress)) {
        this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.WALLET.ACCOUNT_ALREADY_IMPORTED'), this.translateService.instant('ERROR'));
        return;
      }
      const importedAccount: EthereumAccount = {address: importedAddress, privateKey: this.importedPrivateKey};
      this.storeAndSelectNewImportedAccount(importedAccount);
      this.notificationService.showMessage(`${this.translateService.instant('EXTERNAL-SWAP.WALLET.ACCOUNT')} ${importedAccount.address} ${this.translateService.instant('EXTERNAL-SWAP.WALLET.IMPORTED')}`, this.translateService.instant('DONE'));
    }
  }

  private storeAndSelectNewImportedAccount(importedAccount: EthereumAccount): void {
    this.storedAccounts.push(importedAccount);
    this.addresses.push(importedAccount.address);
    this.ethereumAuthenticationService.saveEthereumAccounts(this.storedAccounts);
    this.setAddress(importedAccount.address);
  }

  private isAlreadyImported(address: string): boolean {
    return this.storedAccounts.some((acc => acc.address === address));
  }

  private reloadAccountData() {
    if (!this.address) {
      return;
    }
    this.cleanImportingData();
    this.authenticationService.createQRcode(this.address).then(qr => this.addressQR = qr);
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

  private updateEthBalance(balance: number) {
    if(this.tokenSymbol === 'ETH') {
      this.balance = balance;
    }
    this.ethBalance = balance;
  }

  private updateBalance(balance: number) {
    this.balance = balance;
  }

  private cleanImportingData() {
    this.importInProgress = false;
    this.importedPrivateKey = null;
  }
}
