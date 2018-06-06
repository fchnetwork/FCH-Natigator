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

  importInProgress = false;

  account: EthereumAccount;
  addressQR: string;
  balance = 0;
  storedAccounts: EthereumAccount[] = [];

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
        avatar: './assets/images/avatar-1.png',
        privateKey: ''
      },
      {
        address: '0xf38edc62732c418ee18bebf89cc063b3d1b57e0c',
        avatar: './assets/images/avatar-2.png',
        privateKey: ''
      }];


    this.injectedWeb3 = await this.ethereumAuthenticationService.getInjectedWeb3();
  }

  onWalletSelect(event: { value: EthWalletType }) {
    this.selectedWalletType = event.value;
  }

  async copyToClipboard() {
    if(this.account) {
      await this.clipboardService.copy(this.account.address);
      this.notificationService.showMessage('Copied to clipboard!', 'Done');
    }
  }

  onAccountChange() {
    this.authenticationService.createQRcode(this.account.address).then(qr => this.addressQR = qr);
    this.web3.eth.getBalance(this.account.address).then(balance => this.balance = balance);
  }
}
