import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import Web3 from "web3";
import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { PaymentGatewayWizardStep } from "@app/external/payment-gateway-wizard-steps/payment-gateway-wizard-step";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { ClipboardService } from "@core/general/clipboard-service/clipboard.service";

@Component({
  selector: 'app-ethereum-wallet',
  templateUrl: './ethereum-wallet.component.html',
  styleUrls: ['./ethereum-wallet.component.scss']
})
export class EthereumWalletComponent extends PaymentGatewayWizardStep implements OnInit {

  importInProgress = false;
  addressSelected = false;

  address: string;

  walletTypes = EthWalletType;
  selectedWalletType = EthWalletType.Imported;
  injectedWeb3: Web3;

  constructor(
    location: Location,
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private clipboardService: ClipboardService,
    private ethereumAuthenticationService: EthereumAuthenticationService
  ) {
    super(location);
  }

  async ngOnInit() {
    this.injectedWeb3 = await this.ethereumAuthenticationService.getInjectedWeb3();
  }

  onWalletSelect(event: { value: EthWalletType }) {
    this.selectedWalletType = event.value;
  }

  async copyToClipboard() {
    await this.clipboardService.copy(this.address);
    this.notificationService.showMessage('Copied to clipboard!', 'Done');
  }

  // TODO: Remove
  aerlists = [
    {
      id: 1,
      title: '0x56220873fb32f35a27f5e0f6604fda2aef439a5f',
      img: './assets/images/avatar-1.png',
      icon: 'key',
      disabled: false,
    },
    {
      id: 2,
      title: '0x34520873fb32f35a3325e0f6604fda2aef43955a',
      img: './assets/images/avatar-2.png',
      icon: 'key',
      disabled: true,
    },
    {
      id: 3,
      title: '0xfa520873fb32a35a3325e0f6604fda2aef4355fa',
      img: './assets/images/avatar-3.png',
      icon: 'key',
      disabled: false,
    },
    {
      id: 4,
      title: '0x32faab73fb32a35a3325e0f6604fda2aef43314f',
      img: './assets/images/avatar-4.png',
      icon: 'key',
      disabled: false,
    }
  ];
}
