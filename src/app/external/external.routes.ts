import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ExternalTransactionComponent } from '@app/external/external-transaction/external-transaction.component';
import { EthereumWalletComponent } from "@external/ethereum-wallet/ethereum-wallet.component";
import { SwapCreateComponent } from "@external/swap-create/swap-create.component";
import { SwapConfirmComponent } from "@external/swap-confirm/swap-confirm.component";
import { OppositeSwapCreateComponent } from "@external/opposite-swap-create/opposite-swap-create.component";
import { OppositeSwapConfirmComponent } from './opposite-swap-confirm/opposite-swap-confirm.component';

const ACCOUNT_ROUTES = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'transaction',
        pathMatch: 'full'
      },
      {
        path: 'transaction',
        component: ExternalTransactionComponent
      },
      {
        path: 'eth-wallet',
        component: EthereumWalletComponent
      },
      {
        path: 'create-swap',
        component: SwapCreateComponent
      },
      {
        path: 'confirm-swap',
        component: SwapConfirmComponent
      },
      {
        path: 'create-opposite-swap',
        component: OppositeSwapCreateComponent
      },
      {
        path: 'confirm-opposite-swap',
        component: OppositeSwapConfirmComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ACCOUNT_ROUTES)],
  exports: [RouterModule]
})
export class ExternalRoutingModule {
}
