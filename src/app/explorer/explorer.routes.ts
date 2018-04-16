import {Routes} from '@angular/router';

import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { BlockComponent } from './components/block/block.component';
import { AddressComponent } from './components/address/address.component';
import { Error404Component } from '../shared/components/error404/error404.component'
import { BlocksComponent } from './components/blocks/blocks.component';
import { PendingTxnsComponent } from './components/pending-txns/pending-txns.component';

export const explorerRoutes: Routes = [{
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
        path: 'transaction/:id',
        component: TransactionComponent
      },
      {
        path: 'block/:id',
        component: BlockComponent
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
        path: 'pending',
        component: PendingTxnsComponent
      }
]
}];


