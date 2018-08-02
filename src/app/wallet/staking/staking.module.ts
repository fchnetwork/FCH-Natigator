import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from "@core/core.module";
import { AppUIModule } from "@app/app.ui.module";
import { SharedModule } from '@app/shared/shared.module';
import { StakingRoutingModule } from '@app/wallet/staking/staking.routes';
import { StakingComponent } from './staking.component';
import { EthereumWalletComponent } from './components/ethereum-wallet/ethereum-wallet.component';
import { StakingCreateComponent } from './components/staking-create/staking-create.component';
import { StakingUpdateComponent } from './components/staking-update/staking-update.component';
import { EthereumWalletAccountComponent } from './components/ethereum-wallet/ethereum-wallet-account/ethereum-wallet-account.component';
import { EthereumWalletBalanceComponent } from './components/ethereum-wallet/ethereum-wallet-balance/ethereum-wallet-balance.component';
import { EthereumWalletAccountImportComponent } from './components/ethereum-wallet/ethereum-wallet-account/ethereum-wallet-account-import/ethereum-wallet-account-import.component';
import { StakingLocalStorageService } from '@app/wallet/staking/staking-local-storage/staking-local-storage.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppUIModule,
    CoreModule,
    SharedModule,
    StakingRoutingModule
  ],
  declarations: [
    StakingComponent,
    EthereumWalletComponent,
    StakingCreateComponent,
    StakingUpdateComponent,
    EthereumWalletAccountComponent,
    EthereumWalletBalanceComponent,
    EthereumWalletAccountImportComponent
  ],
  providers: [
    StakingLocalStorageService
  ]
})
export class StakingModule { }
