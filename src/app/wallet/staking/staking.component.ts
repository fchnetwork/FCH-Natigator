import { Component } from '@angular/core';

import { EthereumWalletAccount } from "@app/wallet/staking/models/ethereum-wallet-account.model";

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.scss']
})
export class StakingComponent {
  private account: EthereumWalletAccount;
  canMoveToStaking = false;

  constructor() { }

  updateAccount(account: EthereumWalletAccount) {
    this.account = account;
    this.canMoveToStaking =
      !!this.account.address && !!this.account.walletType && this.account.ethereumBalance > 0 && this.account.aerumBalance > 0;
  }

  moveToStaking() {
    console.log('move to staking');
  }
}
