import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';  
import { SwapToken } from '@swap/models/models';  
import { TokenService } from '@core/transactions/token-service/token.service';

@Component({
  selector: 'app-swap-tokens-list',
  templateUrl: './swap-tokens-list.component.html',
  styleUrls: ['./swap-tokens-list.component.scss']
})
export class SwapTokensListComponent implements OnInit {

  @Input() selectAero: boolean;

  @Output() tokenChange: EventEmitter<SwapToken> = new EventEmitter<SwapToken>();

  selected: SwapToken;
  tokens: SwapToken[];
  aero: SwapToken = {
    address: '',
    symbol: 'Aero',
    decimals: 18
  };

  constructor(private tokensService: TokenService) { }

  ngOnInit() {
    const ercTokens = this.tokensService.getTokens();
    this.tokens = [this.aero].concat(ercTokens);

    if(this.selectAero) {
      this.selected = this.aero;
    }
  }

  onChange() {
    this.tokenChange.emit(this.selected);
  }
}
