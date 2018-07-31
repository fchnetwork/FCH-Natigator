import { Component, Input, Output, EventEmitter } from '@angular/core';

import Web3 from "web3";
import { environment } from '@env/environment';

import { EthWalletType } from "@app/external/models/eth-wallet-type.enum";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";

@Component({
  selector: 'app-ethereum-wallet-balance',
  templateUrl: './ethereum-wallet-balance.component.html',
  styleUrls: ['./ethereum-wallet-balance.component.scss']
})
export class EthereumWalletBalanceComponent {
  private _address: string;
  private _walletType: EthWalletType = EthWalletType.Imported;
  private web3: Web3;
  private injectedWeb3: Promise<Web3>;

  ethereumBalance = 0;
  aerumBalance = 0;
  
  @Output() ethereumBalanceChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() aerumBalanceChanged: EventEmitter<number> = new EventEmitter<number>();

  @Input() set walletType(value: EthWalletType) {
    const newValue = value ? value : EthWalletType.Imported;
    if(this._walletType === newValue) return;
    this._walletType = newValue;
    this.updateBalance();
  }

  @Input() set address(value: string) {
    if(this._address === value) return;
    this._address = value;
    this.updateBalance();
  }

  constructor(private ethereumTokenService: EthereumTokenService,
    private ethereumAuthenticationService: EthereumAuthenticationService) {
      this.web3 = this.ethereumAuthenticationService.getWeb3();
      this.injectedWeb3 = this.ethereumAuthenticationService.getInjectedWeb3(); 
  }

  private async updateBalance(): Promise<void> {
    if(!this._address) {
      this.ethereumBalance = 0;
      this.aerumBalance = 0;
      this.ethereumBalanceChanged.emit(this.ethereumBalance);
      this.aerumBalanceChanged.emit(this.aerumBalance);
      return;
    }
    const xmrAddress = environment.contracts.staking.address.xmr;
    const getAerumBalance = this.ethereumTokenService.getBalance(this._walletType, xmrAddress, this._address);
    const getEthereumBalance = this.getEthereumBalance();

    const [ethereumBalance, aerumBalance] = await Promise.all([getEthereumBalance, getAerumBalance]);
    this.ethereumBalance = ethereumBalance;
    this.aerumBalance = aerumBalance;
    this.ethereumBalanceChanged.emit(this.ethereumBalance);
    this.aerumBalanceChanged.emit(this.aerumBalance);
  }

  private async getEthereumBalance() {
    let balance = 0;
    if (this._walletType === EthWalletType.Injected) {
      const injectedWeb3 = await this.injectedWeb3;
      balance = await injectedWeb3.eth.getBalance(this._address);
    } else {
      balance = await this.web3.eth.getBalance(this._address);
    }
    return balance;
  }
}
