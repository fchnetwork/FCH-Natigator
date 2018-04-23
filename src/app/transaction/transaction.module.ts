import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { AppUIModule } from "../app.ui.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppRoutingModule } from "../app.routes";
import { AuthenticationService } from "../account/services/authentication-service/authentication.service";
import { CanActivateViaAuthGuard } from "../app.guard";
import { ModalService } from "../shared/services/modal.service";
import { TransactionServiceService } from "./services/transaction-service/transaction-service.service";
import { CreateTransactionComponent } from "./create-transaction/create-transaction.component";
import { TransactionSignModalComponent } from "./components/transaction-sign-modal/transaction-sign-modal.component";
import { LastTransactionsComponent } from "@app/transaction/components/last-transactions/last-transactions.component";

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
    ],
    providers: [
        AuthenticationService,
        ModalService,
        TransactionServiceService,
        CanActivateViaAuthGuard
    ]
})
export class TransactionModule { }
