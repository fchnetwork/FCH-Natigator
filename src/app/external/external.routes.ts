import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ExternalTransactionComponent } from '@app/external/external-transaction/external-transaction.component';

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
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(ACCOUNT_ROUTES)],
    exports: [RouterModule]
})
export class ExternalRoutingModule { }
