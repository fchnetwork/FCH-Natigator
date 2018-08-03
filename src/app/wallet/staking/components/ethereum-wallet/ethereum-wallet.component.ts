import { Component, Input, Output, EventEmitter } from '@angular/core';

import { EthWalletType } from "@app/external/models/eth-wallet-type.enum";
import { EthereumWalletAccount } from "@app/wallet/staking/models/ethereum-wallet-account.model";

@Component({
  selector: 'app-ethereum-wallet',
  templateUrl: './ethereum-wallet.component.html',
  styleUrls: ['./ethereum-wallet.component.scss']
})
export class EthereumWalletComponent {
  canMoveToStaking = false;
  address: string;
  walletType: EthWalletType;
  ethereumBalance: number;
  aerumBalance: number;

  @Input() isVisible: boolean;
  @Output() moveToStaking: EventEmitter<EthereumWalletAccount> = new EventEmitter<EthereumWalletAccount>();

  constructor() { }

  updateWalletType(walletType: EthWalletType) {
    this.walletType = walletType;
    this.updateCanMoveToStaking();
  }

  updateAddress(address: string) {
    this.address = address;
    this.updateCanMoveToStaking();
  }

  updateEthereumBalance(ethereumBalance: number) {
    this.ethereumBalance = ethereumBalance;
    this.updateCanMoveToStaking();
  }

  updateAerumBalance(aerumBalance: number) {
    this.aerumBalance = aerumBalance;
    this.updateCanMoveToStaking();
  }

  updateCanMoveToStaking() {
    this.canMoveToStaking = !!this.address 
      && (this.walletType !== null && this.walletType !== undefined) 
      && this.ethereumBalance > 0
      && this.aerumBalance > 0;
  }

  onMoveToStaking() {
    this.moveToStaking.emit({
      address: this.address,
      walletType: this.walletType,
      ethereumBalance: this.ethereumBalance,
      aerumBalance: this.aerumBalance
    });
  }
}
