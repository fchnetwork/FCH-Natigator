import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { HttpModule } from "@angular/http"; 
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Ng2Webstorage } from 'ngx-webstorage';

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routes";

import { AccountModule } from "./account/account.module";
import { SharedModule } from "./shared/shared.module"; 

import { AppUIModule } from "./app.ui.module";

import { ToastModule } from "ng2-toastr"; 
import { TranslateHttpLoader } from "@ngx-translate/http-loader"; 
import { TranslateModule, TranslateLoader } from "@ngx-translate/core"; 
import { BasicModalComponent } from "./shared/components/modals/basic-modal/basic-modal.component"; 
import { TransactionModule } from "@app/wallet/transaction/transaction.module";
import { DiagnosticsModule } from "@app/wallet/diagnostics/diagnostics.module";
import { DashboardModule } from "@app/wallet/dashboard/dashboard.module";
import { SwapModule } from "@app/wallet/swap/swap.module";
import { ExplorerModule } from "@app/wallet/explorer/explorer.module";
import { LoggedInComponent } from "@app/wallet/logged-in/logged-in.component";
 
const modalComponents = [BasicModalComponent];
@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    Ng2Webstorage,
    HttpClientModule,
    HttpModule,
    // aerumWALLET modules
    AccountModule,
    TransactionModule,
    SharedModule,
    DiagnosticsModule,
    DashboardModule.forRoot(),
    SwapModule,
    // aerumUI modules
    AppUIModule,
    // MISC modules
    ToastModule.forRoot(),
    ExplorerModule.forRoot()
  ], 
  declarations: [
    AppComponent,
    modalComponents,
    LoggedInComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
