import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from "@core/core.module";
import { ExternalRoutingModule } from "@app/external/external.routes";
import { AppUIModule } from "@app/app.ui.module";
import { SharedModule } from "@app/shared/shared.module";
import { ExternalTransactionComponent } from "@app/external/external-transaction/external-transaction.component";
import { EthereumWalletComponent } from './ethereum-wallet/ethereum-wallet.component';
import { SwapCreateComponent } from './swap-create/swap-create.component';
import { SwapConfirmComponent } from './swap-confirm/swap-confirm.component';
import { OppositeSwapCreateComponent } from './opposite-swap-create/opposite-swap-create.component';
import { OppositeSwapConfirmComponent } from './opposite-swap-confirm/opposite-swap-confirm.component';
import { AddTokenComponent } from './ethereum-wallet/add-token/add-token.component';

@NgModule({
  entryComponents: [
    ExternalTransactionComponent,
    EthereumWalletComponent,
    SwapCreateComponent,
    SwapConfirmComponent,
    OppositeSwapCreateComponent,
    OppositeSwapConfirmComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    ExternalRoutingModule,
    AppUIModule,
    CoreModule
  ],
  declarations: [
    ExternalTransactionComponent,
    EthereumWalletComponent,
    SwapCreateComponent,
    SwapConfirmComponent,
    OppositeSwapCreateComponent,
    OppositeSwapConfirmComponent,
    AddTokenComponent,
  ]
})
export class ExternalModule {
}
