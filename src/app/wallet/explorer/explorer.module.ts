import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { AddressComponent } from './components/address/address.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ExplorerRoutingModule } from './explorer.routes'; 
import { PendingTxnsComponent } from './components/pending-txns/pending-txns.component'; 
import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module';  
import { CoreModule } from '@app/core/core.module'; 

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
  ]
})
export class ExplorerModule {}


