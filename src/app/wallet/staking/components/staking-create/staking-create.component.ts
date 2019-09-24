import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { EnvironmentService } from "@core/general/environment-service/environment.service";

import { genTransactionExplorerUrl } from "@shared/helpers/url-utils";
import { toBigNumberString } from "@shared/helpers/number-utils";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { StakingGovernanceService } from "@core/staking/staking-governance-service/staking-governance.service";
import { StakingDelegateService } from "@core/staking/staking-delegate-service/staking-delegate.service";
import { EthereumWalletAccount } from '@app/wallet/staking/models/ethereum-wallet-account.model';
import { StakingLocalStorageService } from '@app/wallet/staking/staking-local-storage/staking-local-storage.service';
import { StakingReference } from "@app/wallet/staking/models/staking-reference.model";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";
import { Chain } from '@app/core/swap/cross-chain/swap-template-service/chain.enum';
import { AddressKeyValidationService } from "@app/core/validation/address-key-validation.service";

@Component({
  selector: 'app-staking-create',
  templateUrl: './staking-create.component.html',
  styleUrls: ['./staking-create.component.scss']
})
export class StakingCreateComponent implements OnInit {
  amount = 0;
  address: string;
  stakingInProgress = false;
  transactionExplorerUrl: string;

  @Input() ethereumAccount: EthereumWalletAccount;
  @Output() stakeCreated = new EventEmitter<StakingReference>();

  constructor(private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private stakingGovernanceService: StakingGovernanceService,
    private stakingDelegateService: StakingDelegateService,
    private stakingLocalStorageService: StakingLocalStorageService,
    private ethereumTokenService: EthereumTokenService,
    private addressKeyValidationService: AddressKeyValidationService,
    private environment: EnvironmentService)
  { }

  async ngOnInit() { }

  async stake() {
    try {
      if(!this.addressKeyValidationService.isAddress(this.address)) {
        this.notificationService.showMessage('Please enter a valid address', 'Error');
        return;
      }
      const isKnownDelegate = await this.stakingGovernanceService.isKnown(this.address);
      if(!isKnownDelegate) {
        this.notificationService.showMessage('Specified delegate is unknown. Please enter a valid delegate', 'Error');
        return;
      }
      this.stakingInProgress = true;
      const tokenAmount = await this.getAerumAmount();
      const options = {
        account: this.ethereumAccount.address,
        wallet: this.ethereumAccount.walletType,
        hashCallback: (txHash) => this.transactionExplorerUrl = genTransactionExplorerUrl(txHash, Chain.Ethereum)
      };
      this.notificationService.showMessage(`Stakeding ${this.amount} XRM for ${this.address} delegate`, 'In progress');
      await this.stakingDelegateService.stake(this.address, tokenAmount, options);
      const stakingReference = { address: this.ethereumAccount.address, delegate: this.address, walletType: this.ethereumAccount.walletType };
      this.stakingLocalStorageService.store(stakingReference);
      this.notificationService.showMessage(`Successfully staked ${this.amount} XRM for ${this.address} delegate`, 'Done');
      this.stakeCreated.emit(stakingReference);
      this.stakingInProgress = false;
      this.transactionExplorerUrl = null;
    } catch (err) {
      this.logger.logError('Staking failed', err);
      this.notificationService.showMessage('Unhandled error occurred', 'Error');
      this.stakingInProgress = false;
    }
  }

  canStake(): boolean {
    return !this.stakingInProgress
      && !!this.ethereumAccount
      && !!this.ethereumAccount.address
      && !!this.address
      && this.ethereumAccount.aerumBalance > 0
      && this.amount > 0
      && (this.ethereumAccount.aerumBalance >= this.amount);
  }

  explorerLink(link) {
    window.open(link, '_blank');
  }

  private async getAerumAmount() {
    const aerumAddress = this.environment.get().contracts.staking.address.Aerum;
    const aerumInfo = await this.ethereumTokenService.getNetworkTokenInfo(this.ethereumAccount.walletType, aerumAddress);
    return toBigNumberString(this.amount * Math.pow(10, Number(aerumInfo.decimals)));
  }
}
