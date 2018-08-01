import { Component } from '@angular/core';

import { EthereumWalletAccount } from "@app/wallet/staking/models/ethereum-wallet-account.model";

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.scss']
})
export class StakingComponent {
  ethereumWalletExpanded = true;
  stakingCreateExpanded = false;
  account: EthereumWalletAccount;

  constructor() { }

  moveToStaking(account: EthereumWalletAccount) {
    this.account = account;
    this.ethereumWalletExpanded = false;
    this.stakingCreateExpanded = true;
  }
}
