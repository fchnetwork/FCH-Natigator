import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule} from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { AddressComponent } from './components/address/address.component';
import { SearchComponent } from './components/search/search.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { BlockModalComponent } from './components/block/block-modal/block-modal.component';
import { TransactionModalComponent } from './components/transaction/transaction-modal/transaction-modal.component';
import { GetBlockModalComponent } from './components/block/get-block-modal/get-block-modal.component' 
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ExplorerRoutingModule } from './explorer.routes'; 
import { PendingTxnsComponent } from './components/pending-txns/pending-txns.component'; 
import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module'; 
import { TransactionService } from '@app/core/transaction-service/transaction-service.service'; 
import { CoreModule } from '@app/core/core.module';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}    
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
    SearchComponent,
    modals,
    BlocksComponent,
    PendingTxnsComponent,
  ],
  entryComponents: [
    modals
  ]
})
export class ExplorerModule {}


