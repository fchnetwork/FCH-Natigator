import { Routes, RouterModule } from '@angular/router';

import { TransactionsComponent } from './components/transactions/transactions.component';
import { AddressComponent } from './components/address/address.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { PendingTxnsComponent } from './components/pending-txns/pending-txns.component';
import { NgModule } from "@angular/core";

const EXPLORER_ROUTES: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: TransactionsComponent
    },
    {
      path: 'transactions',
      component: TransactionsComponent
    },
    {
      path: 'blocks',
      component: BlocksComponent
    },
    {
      path: 'address/:id',
      component: AddressComponent
    },
    {
      path: 'transactions/pending',
      component: PendingTxnsComponent
    }
  ]
}];
 
@NgModule({
  imports: [RouterModule.forChild(EXPLORER_ROUTES)],
  exports: [RouterModule]
})
export class ExplorerRoutingModule { }