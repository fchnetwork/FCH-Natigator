import { Component, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';

import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { Token } from "@core/transactions/token-service/token.model";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';

@Component({
  selector: 'app-add-token',
  templateUrl: './add-token.component.html',
  styleUrls: ['./add-token.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTokenComponent {
  tokenAddress: string;
  tokenSymbol: string;
  decimals: number;
  totalSupply: number;
  balance: number;

  @Input() account: string;
  @Input() wallet: EthWalletType;
  @Output() tokenAdded = new EventEmitter<Token>();

  constructor(
    private notificationService: InternalNotificationService,
    private ethereumTokenService: EthereumTokenService
  ) { }

  validateTokens() {
    const tokens = this.ethereumTokenService.getTokens();
    if(tokens.length) {
      for(let i = 0; i < tokens.length; i++) {
        if(this.totalSupply <= 0 || !Number.isInteger(this.totalSupply)) {
          this.notificationService.showMessage('Tokens supply has to be bigger than 0', 'Form error');
          return false;
        } else if(this.tokenSymbol === tokens[i].symbol){
          this.notificationService.showMessage('You cannot add token with the same token name', 'Form error');
          return false;
        } else if (this.tokenAddress === tokens[i].address) {
          this.notificationService.showMessage('You cannot add token with the same token address', 'Form error');
          return false;
        }
      }
    }
    return true;
  }

  async validateForm(): Promise<boolean> {
    let result = true;
    if(!(await this.ethereumTokenService.isAddress(this.wallet, this.tokenAddress))) {
      this.notificationService.showMessage('Tokens address is not valid', 'Form error');
      result = false;
    }
    if(!this.tokenSymbol || this.tokenSymbol.length < 3) {
      this.notificationService.showMessage('Tokens symbol length has to be greater than two', 'Form error');
      result = false;
    }
    if(!Number.isInteger(this.decimals) || this.decimals < 0) {
      this.notificationService.showMessage('Tokens decimals has to be bigger or equal 0', 'Form error');
      result = false;
    }
    return result;
  }

  async onSubmit() {
    const validate = (await this.validateForm()) && this.validateTokens();
    if (validate) {
      const token: Token = {
        address: this.tokenAddress,
        symbol: this.tokenSymbol,
        decimals: this.decimals,
        balance: this.balance,
        totalSupply: this.totalSupply
      };
      this.ethereumTokenService.addToken(token);
      this.tokenAdded.emit(token);
      this.clearTokenData();
    }
  }

  async onAddressChange() {
    if(!this.tokenAddress) {
      this.clearTokenData();
      return;
    }
    try {
      const resolvedAddress = this.tokenAddress;
      if(!resolvedAddress) {
        this.clearTokenData();
        return;
      }
      const token = await this.ethereumTokenService.getNetworkTokenInfo(this.wallet, resolvedAddress, this.account);
      this.tokenSymbol = token.symbol;
      this.decimals = token.decimals;
      this.balance = token.balance;
      this.totalSupply = Number(token.totalSupply) || 0;
    } catch (e) {
      this.clearTokenData();
      console.log(e);
    }
  }

  private clearTokenData() {
    this.tokenSymbol = '';
    this.decimals = null;
    this.balance = 0;
    this.totalSupply = 0;
  }
}
