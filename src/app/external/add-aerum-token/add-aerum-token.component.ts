import { EthWalletType } from './../models/eth-wallet-type.enum';
import { Component, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { TokenService } from '@app/core/transactions/token-service/token.service';
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";
import { AerumNameService } from "@core/aens/aerum-name-service/aerum-name.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import { Token } from "@core/transactions/token-service/token.model";
import { TranslateService } from '@ngx-translate/core';

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
    private ethereumTokenService: EthereumTokenService,
    private translateService: TranslateService) { }

  async onAddressChange() {
    const resolvedAddress = await this.aerumNameService.resolveNameOrAddress(this.tokenFormAddress);
    await this.getTokenInfo(resolvedAddress);
  }

  validateTokens() {
    const tokens = this.storageService.getSessionData('tokens') || [];
    if(tokens.length) {
      for(let i = 0; i < tokens.length; i++) {
        if(this.totalSupply <= 0 || !Number.isInteger(this.totalSupply)) {
          this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.WALLET.ADD_TOKEN.TOKENS_SUPPLY_HAS_TO_BE_BIGGER_THAN_0'), this.translateService.instant('ERROR'));
          return false;
        } else if (this.tokenAddress === tokens[i].address) {
          this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.WALLET.ADD_TOKEN.YOU_CANNOT_ADD_TOKEN_WITH_THE_SAME_TOKEN_ADDRESS'), this.translateService.instant('ERROR'));
          return false;
        }
      }
    }
    return true;
  }

  async validateForm(): Promise<boolean> {
    let result = true;
    if(!(await this.ethereumTokenService.isAddress(EthWalletType.Imported, this.tokenAddress))) {
      this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.WALLET.ADD_TOKEN.TOKENS_ADDRESS_IS_NOT_VALID'), this.translateService.instant('ERROR'));
      result = false;
    } if(!this.tokenSymbol || this.tokenSymbol.length < 3) {
      this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.WALLET.ADD_TOKEN.TOKENS_SYMBOL_LENGTH_HAS_TO_BE_GREATER_THAN_TWO'), this.translateService.instant('ERROR'));
      result = false;
    }
    if(!Number.isInteger(this.decimals) || this.decimals < 0) {
      this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.WALLET.ADD_TOKEN.TOKENS_DECIMALS_HAS_TO_BE_BIGGER_OR_EQUAL_0'), this.translateService.instant('ERROR'));
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
