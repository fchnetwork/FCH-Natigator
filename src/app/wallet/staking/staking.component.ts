import { Component, OnInit } from '@angular/core';

import { StakingLocalStorageService } from '@app/wallet/staking/staking-local-storage/staking-local-storage.service';
import { EthereumWalletAccount } from "@app/wallet/staking/models/ethereum-wallet-account.model";
import { StakingReference } from "@app/wallet/staking/models/staking-reference.model";

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.scss']
})
export class StakingComponent implements OnInit {
  ethereumWalletExpanded = true;
  stakingExpanded = false;
  showStakingUpdate = false;
  account: EthereumWalletAccount;

  private localStakes: StakingReference[];

  constructor(private stakingLocalStorageService: StakingLocalStorageService)
  { }

  ngOnInit() {
    this.updateStakingView();
  }

  onMoveToStaking(account: EthereumWalletAccount) {
    this.account = account;
    this.showStakingUpdate = false;
    this.ethereumWalletExpanded = false;
    this.stakingExpanded = true;
  }

  onStakeCreated() {
    this.updateStakingView();
  }

  private updateStakingView() {
    this.localStakes = this.stakingLocalStorageService.get();
    this.showStakingUpdate = this.localStakes.length > 0;
    if(this.showStakingUpdate) {
      this.ethereumWalletExpanded = false;
      this.stakingExpanded = true;
    }
  }
}
