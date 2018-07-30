import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakingRoutingModule } from '@app/wallet/staking/staking.routes';
import { StakingComponent } from './staking.component';
import { EthereumWalletComponent } from './components/ethereum-wallet/ethereum-wallet.component';
import { StakingCreateComponent } from './components/staking-create/staking-create.component';
import { StakingUpdateComponent } from './components/staking-update/staking-update.component';

@NgModule({
  imports: [
    CommonModule,
    StakingRoutingModule
  ],
  declarations: [StakingComponent, EthereumWalletComponent, StakingCreateComponent, StakingUpdateComponent]
})
export class StakingModule { }
