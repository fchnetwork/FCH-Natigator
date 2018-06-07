import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { EthereumWalletComponent } from "@external/payment-gateway-wizard-steps/ethereum-wallet/ethereum-wallet.component";
import { SwapCreateComponent } from "@external/payment-gateway-wizard-steps/swap-create/swap-create.component";
import { SwapConfirmComponent } from "@external/payment-gateway-wizard-steps/swap-confirm/swap-confirm.component";

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
  amount: number;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(param => {
      this.asset = param.asset;
      this.amount = Number(param.amount) || 0;
    });

    // TODO: Uncomment later
    // this.walletStep.activate();
    this.createSwapStep.activate();
    this.walletStep.setNextStep(this.createSwapStep);
    this.createSwapStep.setNextStep(this.confirmSwapStep);
  }

  ngOnDestroy(): void {
    if(this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}
