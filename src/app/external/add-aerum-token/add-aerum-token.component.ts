import { EthWalletType } from './../models/eth-wallet-type.enum';
import { Component, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { TokenService } from '@app/core/transactions/token-service/token.service';
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";
import { AerumNameService } from "@core/aens/aerum-name-service/aerum-name.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import { Token } from "@core/transactions/token-service/token.model";

@Component({
  selector: 'app-add-aerum-token',
  templateUrl: './add-aerum-token.component.html',
  styleUrls: ['./add-aerum-token.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddAerumTokenComponent {
  tokenFormAddress: string;
  tokenAddress: string;
  tokenSymbol: string;
  decimals: number;
  totalSupply: number;
  balance: number;

  @Output() tokenAdded = new EventEmitter<Token>();

  constructor(private tokenService: TokenService,
    public notificationService: InternalNotificationService,
    private aerumNameService: AerumNameService,
    private storageService: StorageService,
    private ethereumTokenService: EthereumTokenService) { }

  async onAddressChange() {
    const resolvedAddress = await this.aerumNameService.resolveNameOrAddress(this.tokenFormAddress);
    await this.getTokenInfo(resolvedAddress);
  }

  validateTokens() {
    const tokens = this.storageService.getSessionData('tokens') || [];
    if(tokens.length) {
      for(let i = 0; i < tokens.length; i++) {
        if(this.totalSupply <= 0 || !Number.isInteger(this.totalSupply)) {
          this.notificationService.showMessage('Tokens supply has to be bigger than 0', 'Form error');
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
    if(!(await this.ethereumTokenService.isAddress(EthWalletType.Imported, this.tokenAddress))) {
      this.notificationService.showMessage('Tokens address is not valid', 'Form error');
      result = false;
    } if(!this.tokenSymbol || this.tokenSymbol.length < 3) {
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
    if(!this.tokenAddress) {
      this.tokenAddress = this.tokenFormAddress;
    }
    const validTokens = this.validateTokens();
    const validForm = await this.validateForm();
    if (validForm && validTokens) {
      const token = {
        address: await this.aerumNameService.resolveNameOrAddress(this.tokenAddress),
        symbol: this.tokenSymbol,
        decimals: this.decimals,
        balance: this.balance,
        totalSupply: this.totalSupply
      };
      this.tokenService.addToken(token);
      this.tokenAdded.emit(token);
    }
  }

  async getTokenInfo(address) {
    if(!address) {
      this.clearTokenData();
      return;
    }
    try {
      const resolvedAddress = await this.aerumNameService.resolveNameOrAddress(address);
      if(!resolvedAddress) {
        this.clearTokenData();
        return;
      }
      const res = await this.tokenService.getNetworkTokenInfo(resolvedAddress);
      this.fillTokenData(res);
    } catch (e) {
      this.clearTokenData();
    }
  }

  private fillTokenData(data: Token) {
    this.tokenAddress = data.address;
    this.tokenSymbol = data.symbol;
    this.decimals = data.decimals;
    this.balance = data.balance;
    this.totalSupply = Number(data.totalSupply) || 0;
  }

  private clearTokenData() {
    this.tokenSymbol = '';
    this.decimals = null;
    this.balance = 0;
    this.totalSupply = 0;
  }
}
