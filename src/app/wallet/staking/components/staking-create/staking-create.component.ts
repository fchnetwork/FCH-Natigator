import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { environment } from "@env/environment";

import { toBigNumberString } from "@shared/helpers/number-utils";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { StakingGovernanceService } from "@core/staking/staking-governance-service/staking-governance.service";
import { StakingAerumService } from "@core/staking/staking-aerum-service/staking-aerum.service";
import { EthereumWalletAccount } from '@app/wallet/staking/models/ethereum-wallet-account.model';
import { StakingLocalStorageService } from '@app/wallet/staking/staking-local-storage/staking-local-storage.service';
import { StakingReference } from "@app/wallet/staking/models/staking-reference.model";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";

@Component({
  selector: 'app-staking-create',
  templateUrl: './staking-create.component.html',
  styleUrls: ['./staking-create.component.scss']
})
export class StakingCreateComponent implements OnInit {
  amount = 0;
  address: string;
  addresses: string[] = [];

  @Input() ethereumAccount: EthereumWalletAccount;
  @Output() stakeCreated = new EventEmitter<StakingReference>();

  constructor(private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private stakingGovernanceService: StakingGovernanceService,
    private stakingAerumService: StakingAerumService,
    private stakingLocalStorageService: StakingLocalStorageService,
    private ethereumTokenService: EthereumTokenService)
  { }

  async ngOnInit() {
    this.addresses = await this.stakingGovernanceService.getValidDelegates();
    if(this.addresses.length > 0) {
      this.address = this.addresses[0];
    }
  }

  async stake() {
    try {
      const tokenAmount = await this.getAerumAmount();
      const options = { account: this.ethereumAccount.address, wallet: this.ethereumAccount.walletType };
      await this.stakingAerumService.stake(this.address, tokenAmount, options);
      const stakingReference = { address: this.ethereumAccount.address, walletType: this.ethereumAccount.walletType };
      this.stakingLocalStorageService.store(stakingReference);
      this.stakeCreated.emit(stakingReference);
      this.notificationService.showMessage(`Successfully staked ${this.amount} Xmr for ${this.address} delegate`, 'Done');
    } catch (err) {
      this.logger.logError('Staking failed', err);
      this.notificationService.showMessage('Unhandled error occurred', 'Error');
    }
  }

  canStake(): boolean {
    return !!this.ethereumAccount 
      && !!this.ethereumAccount.address
      && !!this.address
      && this.ethereumAccount.aerumBalance > 0
      && this.amount > 0
      && (this.ethereumAccount.aerumBalance >= this.amount);
  }

  private async getAerumAmount() {
    const aerumAddress = environment.contracts.staking.address.Aerum;
    const aerumInfo = await this.ethereumTokenService.getNetworkTokenInfo(this.ethereumAccount.walletType, aerumAddress);
    return toBigNumberString(this.amount * Math.pow(10, Number(aerumInfo.decimals)));
  }
}
