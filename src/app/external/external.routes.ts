import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ExternalTransactionComponent } from '@app/external/external-transaction/external-transaction.component';
import { EthereumWalletComponent } from "@app/external/ethereum-wallet/ethereum-wallet.component";

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
              path: 'wallet',
              component: EthereumWalletComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(ACCOUNT_ROUTES)],
    exports: [RouterModule]
})
export class ExternalRoutingModule { }
