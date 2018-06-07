import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EthereumWalletComponent } from "@app/external/payment-gateway-wizard-steps/ethereum-wallet/ethereum-wallet.component";
import { SwapConfirmComponent } from "@app/external/payment-gateway-wizard-steps/swap-confirm/swap-confirm.component";
import { SwapCreateComponent } from "@app/external/payment-gateway-wizard-steps/swap-create/swap-create.component";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-payment-gateway-wizard',
  templateUrl: './payment-gateway-wizard.component.html',
  styleUrls: ['./payment-gateway-wizard.component.scss']
})
export class PaymentGatewayWizardComponent implements OnInit, OnDestroy {

  @ViewChild(EthereumWalletComponent) walletStep;
  @ViewChild(SwapCreateComponent) createSwapStep;
  @ViewChild(SwapConfirmComponent) confirmSwapStep;

  private routeSubscription: Subscription;

  asset: string;

  constructor(public route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(param => this.asset = param.asset);

    this.walletStep.active = true;
    this.walletStep.setNextStep(this.createSwapStep);
    this.createSwapStep.setNextStep(this.confirmSwapStep);
  }

  ngOnDestroy(): void {
    if(this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}
