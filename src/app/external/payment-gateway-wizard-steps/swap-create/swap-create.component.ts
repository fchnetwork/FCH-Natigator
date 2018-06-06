import { Component, OnInit } from '@angular/core';
import { PaymentGatewayWizardStep } from "../payment-gateway-wizard-step";
import { Location } from "@angular/common";

@Component({
  selector: 'app-swap-create',
  templateUrl: './swap-create.component.html',
  styleUrls: ['./swap-create.component.scss']
})
export class SwapCreateComponent extends PaymentGatewayWizardStep implements OnInit {

  constructor(location: Location) {
    super(location);
  }

  ngOnInit() {
  }

}
