import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CreateTransactionComponent } from "./create-transaction/create-transaction.component";
import { TransactionSignModalComponent } from "./components/transaction-sign-modal/transaction-sign-modal.component";
import { LastTransactionsComponent } from "@app/wallet/transaction/components/last-transactions/last-transactions.component";
import { AppUIModule } from "@app/app.ui.module";
import { SharedModule } from "@app/shared/shared.module";
import { TransactionMoreOptionsComponent } from "@app/wallet/transaction/components/transaction-more-options/transaction-more-options.component";
import { TransactionRoutingModule } from "@app/wallet/transaction/transaction.routes";
import { CoreModule } from "@app/core/core.module";
import { TransactionModalComponent } from "@explorer/components/transaction/transaction-modal/transaction-modal.component";
import { ExplorerModule } from "@explorer/explorer.module";

@NgModule({
    entryComponents: [
      TransactionModalComponent,
      TransactionSignModalComponent,
      CreateTransactionComponent,
      LastTransactionsComponent,
    ],
    imports: [
      FormsModule,
      AppUIModule,
      CommonModule,
      ReactiveFormsModule,
      TransactionRoutingModule,
      SharedModule,
      CoreModule,
      ExplorerModule
    ],
    declarations: [
      CreateTransactionComponent,
      TransactionSignModalComponent,
      LastTransactionsComponent,
      TransactionMoreOptionsComponent,
    ]
})
export class TransactionModule { }
