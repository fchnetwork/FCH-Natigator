import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { AddressComponent } from './components/address/address.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { BlockModalComponent } from './components/block/block-modal/block-modal.component';
import { TransactionModalComponent } from './components/transaction/transaction-modal/transaction-modal.component';
import { GetBlockModalComponent } from './components/block/get-block-modal/get-block-modal.component'
import { ExplorerRoutingModule } from './explorer.routes';
import { PendingTxnsComponent } from './components/pending-txns/pending-txns.component';
import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module';
import { CoreModule } from '@app/core/core.module';

const modals = [BlockModalComponent, TransactionModalComponent, GetBlockModalComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExplorerRoutingModule,
    AppUIModule,
    SharedModule,
    CoreModule
  ],
  declarations: [
    TransactionsComponent,
    AddressComponent,
    BlocksComponent,
    PendingTxnsComponent,
    modals
  ],
  entryComponents: modals
})
export class ExplorerModule {}


