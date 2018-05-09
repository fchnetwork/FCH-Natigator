import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core"; 
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; 
import { TranslateModule } from "@ngx-translate/core";
import { TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader"; 
import { TransactionServiceService } from "./services/transaction-service/transaction-service.service";
import { CreateTransactionComponent } from "./create-transaction/create-transaction.component";
import { TransactionSignModalComponent } from "./components/transaction-sign-modal/transaction-sign-modal.component"; 
import { LastTransactionsComponent } from "@app/wallet/transaction/components/last-transactions/last-transactions.component";
import { AppUIModule } from "@app/app.ui.module";
import { SharedModule } from "@app/shared/shared.module";
import { TransactionMoreOptionsComponent } from "@app/wallet/transaction/components/transaction-more-options/transaction-more-options.component";
import { AuthenticationService } from "@app/account/services/authentication-service/authentication.service";
import { ModalService } from "@app/shared/services/modal.service";
import { CanActivateViaAuthGuard } from "@app/app.guard";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
    entryComponents: [
        TransactionSignModalComponent,
        CreateTransactionComponent,
        LastTransactionsComponent,
    ],
    imports: [
        FormsModule,
        AppUIModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    declarations: [
        CreateTransactionComponent,
        TransactionSignModalComponent,
        LastTransactionsComponent,
        TransactionMoreOptionsComponent,
    ],
    providers: [
        AuthenticationService,
        ModalService,
        TransactionServiceService,
        CanActivateViaAuthGuard
    ]
})
export class TransactionModule { }
