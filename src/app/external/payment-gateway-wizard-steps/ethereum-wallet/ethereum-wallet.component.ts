import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import Web3 from "web3";
import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { SessionStorageService } from "ngx-webstorage";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { ClipboardService } from "@core/general/clipboard-service/clipboard.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { PaymentGatewayWizardStep } from "@app/external/payment-gateway-wizard-steps/payment-gateway-wizard-step";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";

@Component({
  selector: 'app-ethereum-wallet',
  templateUrl: './ethereum-wallet.component.html',
  styleUrls: ['./ethereum-wallet.component.scss']
})
export class EthereumWalletComponent extends PaymentGatewayWizardStep implements OnInit {

  walletTypes = EthWalletType;
  selectedWalletType = EthWalletType.Imported;

  web3: Web3;
  injectedWeb3: Web3;

  storedAccounts: EthereumAccount[] = [];
  selectedStoredAccount: EthereumAccount;

  address: string;
  addressQR: string;
  balance = 0;

  canMoveNext = false;

  importInProgress = false;
  seedFileText: string;

  importedAddress: string;
  importedAccount: EthereumAccount;

  constructor(
    location: Location,
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private clipboardService: ClipboardService,
    private sessionStorageService: SessionStorageService,
    private authenticationService: AuthenticationService,
    private ethereumAuthenticationService: EthereumAuthenticationService
  ) {
    super(location);
  }

  async ngOnInit() {
    this.web3 = this.ethereumAuthenticationService.getWeb3();
    this.storedAccounts = this.sessionStorageService.retrieve('ethereum_accounts') as EthereumAccount[];
    this.injectedWeb3 = await this.ethereumAuthenticationService.getInjectedWeb3();
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

  openSeedFile(event) {
    const input = event.target;
    if (input.files.length) {
      const reader = new FileReader();
      reader.onload = () => this.processSeed(reader.result);
      reader.readAsText(input.files[0]);
    }
  }

  import() {
    if (this.importedAccount) {
      if(this.isAlreadyImported(this.importedAccount)) {
        this.notificationService.showMessage('Account already imported', 'Error');
        return;
      }
      this.storedAccounts.push(this.importedAccount);
      this.ethereumAuthenticationService.saveEthereumAccounts(this.storedAccounts);

      this.selectedStoredAccount = this.importedAccount;
      this.address = this.importedAccount.address;
      this.reloadAccountData();
    }
  }

  private isAlreadyImported(account: EthereumAccount): boolean {
    return this.storedAccounts.some((acc => acc.address === account.address));
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

  onSeedChange() {
    this.processSeed();
  }

  private processSeed(seed?: string): void {
    if (seed && (this.seedFileText !== seed)) {
      this.seedFileText = seed;
    }
    this.authenticationService.generateAddressLogin(this.seedFileText).then(res => {
      this.importedAddress = res.address;
      this.importedAccount = {address: res.address, privateKey: res.private};
    });
  }

  private cleanImportingData() {
    this.importInProgress = false;
    this.importedAddress = null;
    this.importedAccount = null;
    this.seedFileText = null;
  }
}
