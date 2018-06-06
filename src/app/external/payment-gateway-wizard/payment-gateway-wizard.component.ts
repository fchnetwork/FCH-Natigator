import { Component, OnInit, ViewChild } from '@angular/core';
import { EthereumWalletComponent } from "@app/external/payment-gateway-wizard-steps/ethereum-wallet/ethereum-wallet.component";
import { SwapConfirmComponent } from "@app/external/payment-gateway-wizard-steps/swap-confirm/swap-confirm.component";
import { SwapCreateComponent } from "@app/external/payment-gateway-wizard-steps/swap-create/swap-create.component";

@Component({
  selector: 'app-payment-gateway-wizard',
  templateUrl: './payment-gateway-wizard.component.html',
  styleUrls: ['./payment-gateway-wizard.component.scss']
})
export class PaymentGatewayWizardComponent implements OnInit {

  // @ViewChild(EthereumWalletComponent) walletStep;
  @ViewChild(SwapCreateComponent) walletStep;
  @ViewChild(SwapCreateComponent) createSwapStep;
  @ViewChild(SwapConfirmComponent) confirmSwapStep;

  constructor() { }

  ngOnInit() {
    this.walletStep.active = true;
    this.walletStep.setNextStep(this.createSwapStep);
    this.createSwapStep.setNextStep(this.confirmSwapStep);
  }

}
