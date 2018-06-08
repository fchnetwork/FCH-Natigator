import { Component, Input, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { PaymentGatewayWizardStep } from "../payment-gateway-wizard-step";
import { SwapTemplate } from "@core/swap/cross-chain/swap-template-service/swap-template.model";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";
import { sha3 } from "web3-utils";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { AerumErc20SwapService } from "@core/swap/cross-chain/aerum-erc20-swap-service/aerum-erc20-swap.service";

@Component({
  selector: 'app-swap-confirm',
  templateUrl: './swap-confirm.component.html',
  styleUrls: ['./swap-confirm.component.scss']
})
export class SwapConfirmComponent extends PaymentGatewayWizardStep implements OnInit {

  @Input() secret: string;
  @Input() token: any;
  @Input() account: EthereumAccount;
  @Input() template: SwapTemplate;

  aerumAccount: string;

  // TODO: Populate these fields
  acceptedBy = 'cosmiceye.aer';
  sendValue = 0.5;
  sendCurrency = 'ETH';
  receiveValue = 5;
  receiveCurrency = 'Aero';

  constructor(
    location: Location,
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private authService: AuthenticationService,
    private erc20SwapService: AerumErc20SwapService
  ) {
    super(location);
  }

  ngOnInit() {
    const keystore = this.authService.getKeystore();
    this.aerumAccount = "0x" + keystore.address;
  }

  async next() {
    try {
      this.notificationService.showMessage('Completing swap', 'In Progress...');

      const hash = sha3(this.secret);
      await this.erc20SwapService.closeSwap(hash, this.secret);

      this.notificationService.showMessage('Swap Closed', 'Done');
      this.location.back();
    } catch (e) {
      this.logger.logError('Swap close error', e);
      this.notificationService.showMessage('Swap close error', 'Unhandled error');
    }
  }
}
