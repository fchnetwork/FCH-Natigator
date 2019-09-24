import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Web3 from "web3";

import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { genTransactionExplorerUrl } from "@shared/helpers/url-utils";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { StakingDelegateService } from "@core/staking/staking-delegate-service/staking-delegate.service";
import { StakingLocalStorageService } from '@app/wallet/staking/staking-local-storage/staking-local-storage.service';
import { StakingReference } from "@app/wallet/staking/models/staking-reference.model";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import { EthWalletType } from '@app/external/models/eth-wallet-type.enum';
import { Token } from "@core/transactions/token-service/token.model";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";
import { Chain } from '@app/core/swap/cross-chain/swap-template-service/chain.enum';

@Component({
  selector: 'app-staking-update',
  templateUrl: './staking-update.component.html',
  styleUrls: ['./staking-update.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StakingUpdateComponent implements OnInit {
  increaseAmount: number;
  increaseTransactionExplorerUrl: string;
  decreaseAmount: number;
  decreaseTransactionExplorerUrl: string;
  increaseStakingInProgress = false;
  decreaseStakingInProgress = false;
  removeEverything: boolean;

  private web3: Web3;
  private injectedWeb3: Promise<Web3>;
  private aerumTokenInfo: Token;

  accountAddress: string;
  delegateAddress: string;
  accountBalance: number;
  accountEthBalance: number;
  accountAddresses: string[] = [];
  private stakingReference: StakingReference;
  private stakingReferences: StakingReference[] = [];

  stakedBalance: number;
  delegateName: string;

  constructor(private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private stakingDelegateService: StakingDelegateService,
    private stakingLocalStorageService: StakingLocalStorageService,
    private ethereumTokenService: EthereumTokenService,
    private ethereumAuthenticationService: EthereumAuthenticationService,
    private storageService: StorageService,
    private environment: EnvironmentService) {
      this.web3 = this.ethereumAuthenticationService.getWeb3();
      this.injectedWeb3 = this.ethereumAuthenticationService.getInjectedWeb3();
    }

  async ngOnInit() {
    this.aerumTokenInfo = await this.ethereumTokenService.getNetworkTokenInfo(EthWalletType.Imported, this.environment.get().contracts.staking.address.Aerum);
    this.initStaking();
  }

  private initStaking() {
    const storedAccounts = this.storageService.getSessionData('ethereum_accounts') as EthereumAccount[] || [];
    this.stakingReferences =  this.stakingLocalStorageService.get()
      .filter(r => r.walletType === EthWalletType.Injected || storedAccounts.find(a => a.address === r.address));

    if(this.stakingReferences.length > 0) {
      this.accountAddresses = this.stakingReferences.map(r => r.address);
      this.stakingReference = this.stakingReferences[0];
      this.accountAddress = this.stakingReference.address;
      this.delegateAddress = this.stakingReference.delegate;
      this.updateAccountInfo();
    }
  }

  onAccountAddressChange() {
    this.stakingReference = this.stakingReferences.find(r => r.address === this.accountAddress);
    this.updateAccountInfo();
  }

  onRemoveEverythingChange() {
    this.decreaseAmount = this.stakedBalance;
  }

  onDecreaseAmountChange() {
    this.removeEverything = false;
  }

  async increaseStaking() {
    if(!this.canIncreaseStaking()) {
      return;
    }
    try {
      this.increaseStakingInProgress = true;
      const tokenAmount = this.increaseAmount * Math.pow(10, this.aerumTokenInfo.decimals);
      const options = {
        account: this.accountAddress,
        wallet: this.stakingReference.walletType,
        hashCallback: (txHash) => this.increaseTransactionExplorerUrl = genTransactionExplorerUrl(txHash, Chain.Ethereum)
      };
      this.notificationService.showMessage(`Increasing staking ${this.increaseAmount} XRM for ${this.delegateAddress} delegate`, 'In progress');
      await this.stakingDelegateService.stake(this.delegateAddress, tokenAmount, options);
      this.notificationService.showMessage(`Successfully increased staking ${this.increaseAmount} XRM for ${this.delegateAddress} delegate`, 'Done');
      this.updateAccountInfo();
      this.increaseTransactionExplorerUrl = null;
      this.increaseStakingInProgress = false;
    } catch (err) {
      this.logger.logError('Staking increase failed', err);
      this.notificationService.showMessage('Unhandled error occurred', 'Error');
      this.increaseStakingInProgress = false;
    }
  }

  canIncreaseStaking() {
    return !this.increaseStakingInProgress
      && !this.decreaseStakingInProgress
      && this.accountEthBalance > 0
      && this.increaseAmount > 0
      && this.accountBalance >= this.increaseAmount;
  }

  async decreaseStaking() {
    if(!this.canDecreaseStaking()) {
      return;
    }
    try {
      this.decreaseStakingInProgress = true;
      const tokenAmount = this.decreaseAmount * Math.pow(10, this.aerumTokenInfo.decimals);
      const options = {
        account: this.accountAddress,
        wallet: this.stakingReference.walletType,
        hashCallback: (txHash) => this.decreaseTransactionExplorerUrl = genTransactionExplorerUrl(txHash, Chain.Ethereum)
      };
      this.notificationService.showMessage(`Unstaking ${this.decreaseAmount} XRM from ${this.delegateAddress} delegate`, 'In progress');
      await this.stakingDelegateService.unstake(this.delegateAddress, tokenAmount, options);
      this.notificationService.showMessage(`Successfully unstaked ${this.decreaseAmount} XRM from ${this.delegateAddress} delegate`, 'Done');
      this.updateAccountInfo();
      this.decreaseTransactionExplorerUrl = null;
      this.decreaseStakingInProgress = false;
    } catch (err) {
      this.logger.logError('Unstaking failed', err);
      this.notificationService.showMessage('Unhandled error occurred', 'Error');
      this.decreaseStakingInProgress = false;
    }
  }

  canDecreaseStaking() {
    return !this.increaseStakingInProgress
      && !this.decreaseStakingInProgress
      && this.accountEthBalance > 0
      && this.stakedBalance > 0
      && this.decreaseAmount > 0
      && this.stakedBalance >= this.decreaseAmount;
  }

  explorerLink(link) {
    window.open(link, '_blank');
  }

  private async updateAccountInfo() {
    this.increaseAmount = 0;
    this.decreaseAmount = 0;

    const getAccountBalance = this.ethereumTokenService.getBalance(EthWalletType.Imported, this.environment.get().contracts.staking.address.Aerum, this.accountAddress);
    const getAccountEthBalance = this.getEthereumBalance();
    const getStakeInfo = this.stakingDelegateService.getStakeInfo(this.delegateAddress, this.accountAddress);

    const [accountBalance, accountEthBalance, stakeInfo] = await Promise.all([getAccountBalance, getAccountEthBalance, getStakeInfo]);

    this.accountBalance = accountBalance;
    this.accountEthBalance = accountEthBalance;

    this.stakedBalance = stakeInfo.amount / Math.pow(10, this.aerumTokenInfo.decimals);
    this.delegateName = stakeInfo.delegate;
  }

  private async getEthereumBalance() {
    let balance = 0;
    if (this.stakingReference.walletType === EthWalletType.Injected) {
      const injectedWeb3 = await this.injectedWeb3;
      balance = await injectedWeb3.eth.getBalance(this.accountAddress);
    } else {
      balance = await this.web3.eth.getBalance(this.accountAddress);
    }
    return balance;
  }
}
