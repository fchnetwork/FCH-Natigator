import { Component, Input, OnInit } from '@angular/core';
import { PaymentGatewayWizardStep } from "../payment-gateway-wizard-step";
import { Location } from "@angular/common";
import { AerumNameService } from '@app/core/aens/aerum-name-service/aerum-name.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-swap-create',
  templateUrl: './swap-create.component.html',
  styleUrls: ['./swap-create.component.scss']
})
export class SwapCreateComponent extends PaymentGatewayWizardStep implements OnInit {
  @Input() asset: string;

  tokens = [
    {title: 'AERO', icon: 'aerumleaf'}
  ];
  selectedToken = this.tokens[0];
  counterParties = [
    {
      name: 'radekwallet.aer',
      // address: await this.nameService.resolveNameOrAddress('radek.aer'),
      address: '0xb65b8c2376293fea13f6ed7d2a8467f0949c312d',
    }
  ];
  selectedCounterParty = this.counterParties[0];

  constructor(
    location: Location,
    public nameService: AerumNameService,
    public router: Router
  ) {
    super(location);
  }

  ngOnInit() {
  }

  cancel() {
    this.router.navigate(['/wallet/home']);
  }

}
