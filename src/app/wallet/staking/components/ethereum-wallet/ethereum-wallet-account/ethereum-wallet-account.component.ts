import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import Web3 from "web3";

import { LoggerService } from "@core/general/logger-service/logger.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthWalletType } from "@app/external/models/eth-wallet-type.enum";
import { StakingReference } from "@app/wallet/staking/models/staking-reference.model";
import { StakingLocalStorageService } from '@app/wallet/staking/staking-local-storage/staking-local-storage.service';

@Component({
  selector: 'app-ethereum-wallet-account',
  templateUrl: './ethereum-wallet-account.component.html',
  styleUrls: ['./ethereum-wallet-account.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EthereumWalletAccountComponent implements OnInit {
  address: string;
  selectedWalletType: EthWalletType;

  @Output() addressChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() walletTypeChanged: EventEmitter<EthWalletType> = new EventEmitter<EthWalletType>();

  storedAccounts: EthereumAccount[] = [];
  addresses: string[] = [];

  walletTypes = EthWalletType;
  injectedWeb3: Web3;
  injectedWeb3Name: string;

  importInProgress = false;

  private stakingReferences: StakingReference[] = [];

  constructor(private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private storageService: StorageService,
    private stakingLocalStorageService: StakingLocalStorageService,
    private ethereumAuthenticationService: EthereumAuthenticationService) { }

  async ngOnInit() {
    this.onWalletSelect({ value: EthWalletType.Imported });
    this.initStakingReferences();
    await this.initPredefinedAccount();
  }

  private initStakingReferences() {
    this.stakingReferences =  this.stakingLocalStorageService.get();
  }

  private async initPredefinedAccount() {
    this.storedAccounts = this.storageService.getSessionData('ethereum_accounts') as EthereumAccount[] || [];
    if (!this.storedAccounts.length) {
      this.generatePredefinedAccount();
    } else {
      this.onImportedWalledSelected();
    }

    [this.injectedWeb3, this.injectedWeb3Name] = await Promise.all([
      this.ethereumAuthenticationService.getInjectedWeb3(),
      this.ethereumAuthenticationService.getInjectedProviderName()
    ]);
  }

  private generatePredefinedAccount(): void {
    try {
      const seed = this.storageService.getSessionData('seed');
      if (seed) {
        const predefinedAccount = this.ethereumAuthenticationService.generateAddressFromSeed(seed);
        this.storeAndSelectNewImportedAccount(predefinedAccount);
      }
    } catch (e) {
      this.logger.logError('Generating predefined account failed', e);
    }
  }

  private storeAndSelectNewImportedAccount(importedAccount: EthereumAccount): void {
    if(this.isAddressStaked(importedAccount.address)) {
      return;
    }
    this.storedAccounts.push(importedAccount);
    this.addresses.push(importedAccount.address);
    this.ethereumAuthenticationService.saveEthereumAccounts(this.storedAccounts);
    this.setAddress(importedAccount.address);
  }

  onAddressChange() {
    this.importInProgress = !this.address;
    this.setAddress(this.address);
  }

  async onWalletSelect(event: { value: EthWalletType }) {
    try {
      this.selectedWalletType = event.value;
      if (this.selectedWalletType === EthWalletType.Injected) {
        await this.onInjectedWalletSelected();
      } else {
        this.onImportedWalledSelected();
      }
      this.walletTypeChanged.emit(this.selectedWalletType);
    } catch (e) {
      this.logger.logError('Error while selecting ethereum account provider', e);
      this.notificationService.showMessage('Unhandled error occurred', 'Error');
    }
  }

  storeImportedAccount(importedAccount: EthereumAccount) {
    this.storeAndSelectNewImportedAccount(importedAccount);
    this.notificationService.showMessage(`Account ${importedAccount.address} imported`, 'Done');
  }

  private onImportedWalledSelected() {
    this.setAddresses(this.storedAccounts.map(acc => acc.address));
    if (!this.addresses || !this.addresses.length) {
      this.setAddress(null);
    } else {
      this.setAddress(this.addresses[0]);
    }
  }

  private async onInjectedWalletSelected() {
    const accounts = await this.injectedWeb3.eth.getAccounts();
    if (!accounts || !accounts.length) {
      this.setAddresses([]);
      this.setAddress(null);
      this.notificationService.showMessage('Please login in Mist / Metamask', 'Cannot get accounts from wallet');
    } else {
      this.setAddresses(accounts);
      this.setAddress(this.addresses[0]);
    }
  }

  private setAddress(address: string){
    this.address = address;
    this.addressChanged.emit(this.address);
  }

  private setAddresses(addresses: string[]) {
    this.addresses = addresses.filter(a => !this.isAddressStaked(a));
  }

  private isAddressStaked(address: string) {
    return !!this.stakingReferences.find(r => r.address === address);
  }
}