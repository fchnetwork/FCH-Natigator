import {Routes} from '@angular/router';

import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { BlockComponent } from './components/block/block.component';
import { AddressComponent } from './components/address/address.component';
import { Error404Component } from '../shared/components/error404/error404.component'

export const explorerRoutes: Routes = [{
path: '',
children: [
      {
        path: '',
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
        path: 'address/:id',
        component: AddressComponent
      }
]
}];


