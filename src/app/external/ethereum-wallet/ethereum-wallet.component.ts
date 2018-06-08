import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import Web3 from "web3";

import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";

import { SessionStorageService } from "ngx-webstorage";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { ClipboardService } from "@core/general/clipboard-service/clipboard.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-ethereum-wallet',
  templateUrl: './ethereum-wallet.component.html',
  styleUrls: ['./ethereum-wallet.component.scss']
})
export class EthereumWalletComponent implements OnInit, OnDestroy {

  private routeSubscription: Subscription;
  private paramAsset: string;
  private paramAmount: number;

  private web3: Web3;
  private injectedWeb3: Web3;

  walletTypes = EthWalletType;
  selectedWalletType = EthWalletType.Imported;

  storedAccounts: EthereumAccount[] = [];
  selectedStoredAccount: EthereumAccount;

  address: string;
  addressQR: string;
  balance = 0;

  canMoveNext = false;

  importInProgress = false;
  importedPrivateKey: string;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private clipboardService: ClipboardService,
    private sessionStorageService: SessionStorageService,
    private authenticationService: AuthenticationService,
    private ethereumAuthenticationService: EthereumAuthenticationService
  ) { }

  async ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(param => {
      this.paramAsset = param.asset;
      this.paramAmount = Number(param.amount) || 0;
    });

    this.web3 = this.ethereumAuthenticationService.getWeb3();
    this.storedAccounts = this.sessionStorageService.retrieve('ethereum_accounts') as EthereumAccount[] || [];
    if (!this.storedAccounts.length) {
      this.generatePredefinedAccount();
    } else {
      this.selectAccount(this.storedAccounts[0]);
      this.reloadAccountData();
    }

    this.injectedWeb3 = await this.ethereumAuthenticationService.getInjectedWeb3();
  }

  private generatePredefinedAccount(): void {
    try {
      const seed = this.sessionStorageService.retrieve('seed');
      if (seed) {
        const predefinedAccount = this.ethereumAuthenticationService.generateAddressFromSeed(seed);
        this.storeNewImportedAccount(predefinedAccount);
      }
    } catch (e) {
      this.logger.logError('Generating predefined account failed', e);
    }
  }

  async onWalletSelect(event: { value: EthWalletType }) {
    this.selectedWalletType = event.value;
    if (this.selectedWalletType === EthWalletType.Injected) {
      await this.onInjectedWalletSelected();
    } else {
      this.onImportedWalledSelected();
    }
    this.reloadAccountData();
  }

  private async onInjectedWalletSelected() {
    const accounts = await this.injectedWeb3.eth.getAccounts();
    if (!accounts || !accounts.length) {
      this.address = null;
      this.notificationService.showMessage('Please login in Mist / Metamask', 'Cannot get accounts from wallet');
    } else {
      this.address = accounts[0];
    }
  }

  private onImportedWalledSelected() {
    if (this.selectedStoredAccount) {
      this.address = this.selectedStoredAccount.address;
    }
    else {
      this.address = null;
    }
  }

  async copyToClipboard() {
    if (this.address) {
      await this.clipboardService.copy(this.address);
      this.notificationService.showMessage('Copied to clipboard!', 'Done');
    }
  }

  onStoredAccountChange() {
    // NOTE: If no address selected we import new one
    if (this.selectedStoredAccount) {
      this.address = this.selectedStoredAccount.address;
      this.reloadAccountData();
    } else {
      this.importInProgress = true;
      this.address = null;
    }
  }

  import() {
    if (this.importedPrivateKey) {
      if (!this.importedPrivateKey.startsWith('0x')) {
        this.importedPrivateKey = "0x" + this.importedPrivateKey;
      }

      const importedAddress = this.authenticationService.generateAddressFromPrivateKey(this.importedPrivateKey);
      if (this.isAlreadyImported(importedAddress)) {
        this.notificationService.showMessage('Account already imported', 'Error');
        return;
      }
      const importedAccount: EthereumAccount = {address: importedAddress, privateKey: this.importedPrivateKey};
      this.storeNewImportedAccount(importedAccount);
      this.notificationService.showMessage(`Account ${importedAccount.address} imported`, 'Done');
    }
  }

  private storeNewImportedAccount(importedAccount: EthereumAccount): void {
    this.storedAccounts.push(importedAccount);
    this.ethereumAuthenticationService.saveEthereumAccounts(this.storedAccounts);

    this.selectAccount(importedAccount);
    this.reloadAccountData();
  }

  private selectAccount(account: EthereumAccount): void {
    if(account) {
      this.selectedStoredAccount = account;
      this.address = account.address;
    }
  }

  private isAlreadyImported(address: string): boolean {
    return this.storedAccounts.some((acc => acc.address === address));
  }

  private reloadAccountData() {
    if (!this.address) {
      this.canMoveNext = false;
      return;
    }

    this.cleanImportingData();
    this.authenticationService.createQRcode(this.address).then(qr => this.addressQR = qr);
    if (this.selectedWalletType === EthWalletType.Injected) {
      this.injectedWeb3.eth.getBalance(this.address).then((balance) => this.updateBalance(balance));
    } else {
      this.web3.eth.getBalance(this.address).then((balance) => this.updateBalance(balance));
    }
  }

  private updateBalance(balance: number) {
    this.balance = balance;
    this.canMoveNext = balance > 0;
  }

  private cleanImportingData() {
    this.importInProgress = false;
    this.importedPrivateKey = null;
  }

  next() {
    return this.router.navigate(['external/create-swap'], {
      queryParams: {
        asset: this.paramAsset,
        amount: this.paramAmount,
        wallet: this.selectedWalletType,
        account: this.address
      }
    });
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
