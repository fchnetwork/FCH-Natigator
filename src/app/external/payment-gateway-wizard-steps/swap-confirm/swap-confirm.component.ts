import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { PaymentGatewayWizardStep } from "../payment-gateway-wizard-step";
import { Router } from '@angular/router';

@Component({
  selector: 'app-swap-confirm',
  templateUrl: './swap-confirm.component.html',
  styleUrls: ['./swap-confirm.component.scss']
})
export class SwapConfirmComponent extends PaymentGatewayWizardStep implements OnInit {
  acceptedBy = 'cosmiceye.aer';
  sendValue = 0.5;
  sendCurrency = 'ETH';
  receiveValue = 5;
  receiveCurrency = 'Aero';
  secretKey = '0x90b66549a6f587d753091b2c957655c608f865741d...';
  constructor(
    location: Location,
    public router: Router,
  ) {
    super(location);
  }

  ngOnInit() {
  }

  cancel() {
    this.router.navigate(['/wallet/home']);
  }

}
