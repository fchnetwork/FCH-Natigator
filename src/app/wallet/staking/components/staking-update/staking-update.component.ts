import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Web3 from "web3";
import { environment } from "@env/environment";

import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { StakingAerumService } from "@core/staking/staking-aerum-service/staking-aerum.service";
import { StakingLocalStorageService } from '@app/wallet/staking/staking-local-storage/staking-local-storage.service';
import { StakingReference } from "@app/wallet/staking/models/staking-reference.model";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import { EthWalletType } from '@app/external/models/eth-wallet-type.enum';
import { Token } from "@core/transactions/token-service/token.model";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";

@Component({
  selector: 'app-staking-update',
  templateUrl: './staking-update.component.html',
  styleUrls: ['./staking-update.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StakingUpdateComponent implements OnInit {
  increaseAmount: number;
  decreaseAmount: number;
  removeEverything: boolean;

  private web3: Web3;
  private injectedWeb3: Promise<Web3>;
  private aerumTokenInfo: Token;

  accountAddress: string;
  accountBalance: number;
  accountEthBalance: number;
  accountAddresses: string[] = [];
  private stakingReference: StakingReference;
  private stakingReferences: StakingReference[] = [];

  stakedBalance: number;
  delegateAddress: string;
  delegateName: string;

  constructor(private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private stakingAerumService: StakingAerumService,
    private stakingLocalStorageService: StakingLocalStorageService,
    private ethereumTokenService: EthereumTokenService,
    private ethereumAuthenticationService: EthereumAuthenticationService,
    private storageService: StorageService) {
      this.web3 = this.ethereumAuthenticationService.getWeb3();
      this.injectedWeb3 = this.ethereumAuthenticationService.getInjectedWeb3();
    }

  async ngOnInit() {
    this.aerumTokenInfo = await this.ethereumTokenService.getNetworkTokenInfo(EthWalletType.Imported, environment.contracts.staking.address.Aerum);
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
    try {
      const tokenAmount = this.increaseAmount * Math.pow(10, this.aerumTokenInfo.decimals);
      const options = { account: this.accountAddress, wallet: this.stakingReference.walletType };
      await this.stakingAerumService.stake(this.delegateAddress, tokenAmount, options);
      this.notificationService.showMessage(`Successfully increased staking ${this.increaseAmount} Xmr for ${this.delegateAddress} delegate`, 'Done');
      this.updateAccountInfo();
    } catch (err) {
      this.logger.logError('Staking increase failed', err);
      this.notificationService.showMessage('Unhandled error occurred', 'Error');
    }
  }

  canIncreaseStaking() {
    return this.accountEthBalance > 0
      && this.increaseAmount > 0
      && this.accountBalance >= this.increaseAmount;
  }

  async decreaseStaking() {
    try {
      const tokenAmount = this.decreaseAmount * Math.pow(10, this.aerumTokenInfo.decimals);
      const options = { account: this.accountAddress, wallet: this.stakingReference.walletType };
      await this.stakingAerumService.unstake(tokenAmount, options);
      this.notificationService.showMessage(`Successfully unstaked ${this.decreaseAmount} Xmr from ${this.delegateAddress} delegate`, 'Done');
      this.updateAccountInfo();
    } catch (err) {
      this.logger.logError('Unstaking failed', err);
      this.notificationService.showMessage('Unhandled error occurred', 'Error');
    }
  }

  canDecreaseStaking() {
    return this.accountEthBalance > 0
      && this.stakedBalance > 0
      && this.decreaseAmount > 0
      && this.stakedBalance >= this.decreaseAmount;
  }

  private async updateAccountInfo() {
    this.increaseAmount = 0;
    this.decreaseAmount = 0;

    const getAccountBalance = this.ethereumTokenService.getBalance(EthWalletType.Imported, environment.contracts.staking.address.Aerum, this.accountAddress);
    const getAccountEthBalance = this.getEthereumBalance();
    const getStakeInfo = this.stakingAerumService.getStakeInfo(this.accountAddress);

    const [accountBalance, accountEthBalance, stakeInfo] = await Promise.all([getAccountBalance, getAccountEthBalance, getStakeInfo]);

    this.accountBalance = accountBalance;
    this.accountEthBalance = accountEthBalance;

    this.stakedBalance = stakeInfo.amount / Math.pow(10, this.aerumTokenInfo.decimals);
    this.delegateAddress = stakeInfo.delegate;
    //this.delegateName = stakeInfo.delegateName; TODO: Populate delegate name when available
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
