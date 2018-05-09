import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CreateTransactionComponent } from "@app/wallet/transaction/create-transaction/create-transaction.component";
import { LoggedInComponent } from "@app/wallet/logged-in/logged-in.component";

export const TRANSACTION_ROUTES = [
    {
        path: '',
        component: LoggedInComponent,
        children: [
            {
                path: '',
                component: CreateTransactionComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(TRANSACTION_ROUTES)],
    exports: [RouterModule]
})
export class TransactionRoutingModule { }