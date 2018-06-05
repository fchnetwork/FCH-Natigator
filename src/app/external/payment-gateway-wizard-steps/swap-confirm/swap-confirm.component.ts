import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { PaymentGatewayWizardStep } from "../payment-gateway-wizard-step";

@Component({
  selector: 'app-swap-confirm',
  templateUrl: './swap-confirm.component.html',
  styleUrls: ['./swap-confirm.component.scss']
})
export class SwapConfirmComponent extends PaymentGatewayWizardStep implements OnInit {

  constructor(location: Location) {
    super(location);
  }

  ngOnInit() {
  }

}
