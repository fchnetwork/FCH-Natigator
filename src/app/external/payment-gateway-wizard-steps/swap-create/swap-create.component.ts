import { Component, Input, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import { Guid } from "@shared/helpers/guid";
import { PaymentGatewayWizardStep } from "../payment-gateway-wizard-step";
import { AerumNameService } from '@app/core/aens/aerum-name-service/aerum-name.service';
import { TokenService } from "@core/transactions/token-service/token.service";

@Component({
  selector: 'app-swap-create',
  templateUrl: './swap-create.component.html',
  styleUrls: ['./swap-create.component.scss']
})
export class SwapCreateComponent extends PaymentGatewayWizardStep implements OnInit {
  @Input() asset: string;
  @Input() amount: number;

  tokens = [];
  selectedToken: any;
  secret: string;

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
    private nameService: AerumNameService,
    private tokenService: TokenService,
  ) {
    super(location);
  }

  ngOnInit() {
    this.secret = Guid.newGuid().replace(/-/g, '')
    this.tokens = this.tokenService.getTokens() || [];
    this.ensureDepositTokenPresent();
  }

  private ensureDepositTokenPresent(): void {
    const isPresent = this.tokens.some(token => token.address === this.asset);
    if(!isPresent) {
      this.loadDepositTokenAndAddToList();
    } else {
      this.selectDefaultToken();
    }
  }

  private loadDepositTokenAndAddToList() {
    // TODO: Maybe add ANS resolver?
    this.tokenService.getTokensInfo(this.asset).then(token => {
      this.tokens = this.tokens.splice(0, 0, token);
      this.selectDefaultToken();
    });
  }

  private selectDefaultToken() {
    if(this.tokens.length) {
      this.selectedToken = this.tokens[0];
    }
  }
}
