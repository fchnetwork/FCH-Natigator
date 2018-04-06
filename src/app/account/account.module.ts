import { AccountRoutingModule } from "./account.routes";
import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { AppUIModule } from "../app.ui.module";
import { LoginComponent } from "./login/login.component";
import { AvatarSelectComponent } from "./components/avatar-select/avatar-select.component";
import { BasicModalComponent } from "../shared/components/modals/basic-modal/basic-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastModule } from "ng2-toastr";
import { ExplorerModule } from "../explorer/explorer.module";
import { SharedModule } from "../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppRoutingModule } from "../app.routes";
import { AuthenticationService } from "./services/authentication-service/authentication.service"; 
import { CanActivateViaAuthGuard } from "../app.guard";
import { ModalService } from "../shared/services/modal.service";
import { TransactionServiceService } from "./services/transaction-service/transaction-service.service";
import { RegisterComponent } from './register/register.component';
import { BackupCreateComponent } from './backup-create/backup-create.component';
import { BackupConfirmComponent } from './backup-confirm/backup-confirm.component';
import { RestoreComponent } from './restore/restore.component'; 
import { BackupDisclamerComponent } from "./backup-disclamer/backup-disclamer.component";
import { BackupPromptComponent } from "./backup-prompt/backup-prompt.component";
import { CreateTransactionComponent } from "./create-transaction/create-transaction.component";

const modalComponents = [BasicModalComponent];

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
    imports: [
        AccountRoutingModule,
        AppUIModule,
        FormsModule,
        CommonModule,
        ToastModule.forRoot(),
        ExplorerModule.forRoot(),
        SharedModule,
        ReactiveFormsModule
    ],
    declarations: [
        modalComponents,
        LoginComponent,
        AvatarSelectComponent, 
        RegisterComponent,
        BackupCreateComponent,
        BackupConfirmComponent,
        BackupPromptComponent,
        BackupDisclamerComponent,
        LoginComponent,
        CreateTransactionComponent
    ],
    providers: [
        AuthenticationService,
        ModalService,
        TransactionServiceService,
        CanActivateViaAuthGuard
    ]
})
export class AccountModule { } 
