import { Component, Output, EventEmitter } from '@angular/core';

import { EthWalletType } from "@app/external/models/eth-wallet-type.enum";
import { EthereumWalletAccount } from "@app/wallet/staking/models/ethereum-wallet-account.model";

@Component({
  selector: 'app-ethereum-wallet',
  templateUrl: './ethereum-wallet.component.html',
  styleUrls: ['./ethereum-wallet.component.scss']
})
export class EthereumWalletComponent {
  address: string;
  walletType: EthWalletType;
  ethereumBalance: number;
  aerumBalance: number;

  @Output() accountChanged: EventEmitter<EthereumWalletAccount> = new EventEmitter<EthereumWalletAccount>();

  constructor() { }

  updateWalletType(walletType: EthWalletType) {
    this.walletType = walletType;
    this.updateAccount();
  }

  updateAddress(address: string) {
    this.address = address;
    this.updateAccount();
  }

  updateEthereumBalance(ethereumBalance: number) {
    this.ethereumBalance = ethereumBalance;
    this.updateAccount();
  }

  updateAerumBalance(aerumBalance: number) {
    this.aerumBalance = aerumBalance;
    this.updateAccount();
  }

  updateAccount() {
    this.accountChanged.emit({
      address: this.address,
      walletType: this.walletType,
      ethereumBalance: this.ethereumBalance,
      aerumBalance: this.aerumBalance
    });
  }
}
