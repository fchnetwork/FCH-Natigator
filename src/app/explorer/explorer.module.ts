import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule} from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { BlockComponent } from './components/block/block.component';
import { AddressComponent } from './components/address/address.component';
import { SearchComponent } from './components/search/search.component';
import { BlocksComponent } from './components/blocks/blocks.component';

import { BlockModalComponent } from './components/block/block-modal/block-modal.component';
import { TransactionModalComponent } from './components/transaction/transaction-modal/transaction-modal.component';

import { ExplorerService } from './services/explorer.service';

import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { EXPLORER_ROUTES } from './explorer.routes';
import { AppUIModule } from '../app.ui.module';
import { PendingTxnsComponent } from './components/pending-txns/pending-txns.component';
import { SharedModule } from '../shared/shared.module';

// The translate loader needs to know where to load i18n files
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}    

const modals = [BlockModalComponent, TransactionModalComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),      
    RouterModule.forChild(EXPLORER_ROUTES),
    AppUIModule,
    SharedModule,
  ],
  declarations: [
    TransactionsComponent,
    TransactionComponent,
    BlockComponent,
    AddressComponent,
    SearchComponent,
    modals,
    BlocksComponent,
    PendingTxnsComponent,
  ],
  entryComponents: [
    modals
  ]
  // providers: [
  //   ExplorerService
  // ],  
})

export class ExplorerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ExplorerModule,
      providers: [
        ExplorerService
      ]
    };
  }
}


