import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import Web3 from "web3";
import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { PaymentGatewayWizardStep } from "@app/external/payment-gateway-wizard-steps/payment-gateway-wizard-step";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { ClipboardService } from "@core/general/clipboard-service/clipboard.service";
import { SessionStorageService } from "ngx-webstorage";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";

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
  selectedStoredAddress: EthereumAccount;

  address: string;
  addressQR: string;
  balance = 0;

  canMoveNext = false;
  importInProgress = false;

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
    // TODO: For testing only
    this.storedAccounts = [
      {
        address: '0x56220873fb32f35a27f5e0f6604fda2aef439a5f',
        privateKey: ''
      },
      {
        address: '0xf38edc62732c418ee18bebf89cc063b3d1b57e0c',
        privateKey: ''
      }];

    this.injectedWeb3 = await this.ethereumAuthenticationService.getInjectedWeb3();
  }

  async onWalletSelect(event: { value: EthWalletType }) {
    this.selectedWalletType = event.value;
    if(this.selectedWalletType === EthWalletType.Injected) {
      await this.onInjectedWalletSelected();
    } else {
      await this.onImportedWalletSelected();
    }
  }

  private async onInjectedWalletSelected() {
    const accounts = await this.injectedWeb3.eth.getAccounts();
    if(!accounts || !accounts.length) {
      this.address = null;
      this.notificationService.showMessage('Please login in Mist / Metamask', 'Cannot get accounts from wallet');
    } else {
      this.address =  accounts[0];
    }
    this.reloadAccountData();
  }

  private async onImportedWalletSelected() { }

  async copyToClipboard() {
    if(this.address) {
      await this.clipboardService.copy(this.address);
      this.notificationService.showMessage('Copied to clipboard!', 'Done');
    }
  }

  onStoredAccountChange() {
    this.address = this.selectedStoredAddress.address;
    this.reloadAccountData();
  }

  private reloadAccountData() {
    if (!this.address) {
      this.canMoveNext = false;
      return;
    }

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
}
