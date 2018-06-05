import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import { LoggerService } from "@core/general/logger-service/logger.service";
import { PaymentGatewayWizardStep } from "@app/external/payment-gateway-wizard-steps/payment-gateway-wizard-step";

@Component({
  selector: 'app-ethereum-wallet',
  templateUrl: './ethereum-wallet.component.html',
  styleUrls: ['./ethereum-wallet.component.scss']
})
export class EthereumWalletComponent extends PaymentGatewayWizardStep implements OnInit {

  constructor(
    location: Location,
    private logger: LoggerService
  ) {
    super(location);
  }

  ngOnInit() {

  }

  // TODO: Remove
  address = "0xdfddufhdsfdsofjsdofisf";

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
