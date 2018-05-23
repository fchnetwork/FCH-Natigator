import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CreateTransactionComponent } from "@app/wallet/transaction/create-transaction/create-transaction.component"; 

export const TRANSACTION_ROUTES = [
    {
        path: '',
        component: CreateTransactionComponent,
        data: { sidebarGroup: 'transaction'}
    }
];

@NgModule({
    imports: [RouterModule.forChild(TRANSACTION_ROUTES)],
    exports: [RouterModule]
})
export class TransactionRoutingModule { }