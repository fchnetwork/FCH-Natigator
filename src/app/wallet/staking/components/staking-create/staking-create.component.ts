import { Component, Input, OnInit } from '@angular/core';

import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { StakingGovernanceService } from "@core/staking/staking-governance-service/staking-governance.service";
import { StakingAerumService } from "@core/staking/staking-aerum-service/staking-aerum.service";
import { EthereumWalletAccount } from '@app/wallet/staking/models/ethereum-wallet-account.model';

@Component({
  selector: 'app-staking-create',
  templateUrl: './staking-create.component.html',
  styleUrls: ['./staking-create.component.scss']
})
export class StakingCreateComponent implements OnInit {
  amount: number;
  address: string;
  addresses: string[] = [];

  @Input() ethereumAccount: EthereumWalletAccount;

  constructor(private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private stakingGovernanceService: StakingGovernanceService,
    private stakingAerumService: StakingAerumService)
  { }

  async ngOnInit() {
    this.addresses = await this.stakingGovernanceService.getValidDelegates();
  }

  async stake() {
    try {
      const options = { account: this.ethereumAccount.address, wallet: this.ethereumAccount.walletType };
      await this.stakingAerumService.stake(this.address, this.amount, options);
      this.notificationService.showMessage(`Successfully staked ${this.amount} Xmr for ${this.address} delegate`, 'Done');
    } catch (e) {
      this.logger.logError('Staking failed', e);
      this.notificationService.showMessage('Unhandled error occurred', 'Error');
    }
  }

  canStake(): boolean {
    return this.ethereumAccount 
      && this.ethereumAccount.address
      && this.address
      && this.ethereumAccount.aerumBalance > 0
      && (this.ethereumAccount.aerumBalance >= this.amount);
  }
}
