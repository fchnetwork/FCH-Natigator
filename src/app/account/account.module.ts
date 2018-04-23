import { AccountRoutingModule } from "./account.routes";
import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { AppUIModule } from "../app.ui.module";
import { LoginComponent } from "./login/login.component";
import { AvatarSelectComponent } from "./components/avatar-select/avatar-select.component";
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
import { CanActivateViaAuthGuard, CanActivateAccountAuthGuard } from "../app.guard";
import { ModalService } from "../shared/services/modal.service";
import { RegisterComponent } from './register/register.component';
import { BackupCreateComponent } from './backup-create/backup-create.component';
import { BackupConfirmComponent } from './backup-confirm/backup-confirm.component'; 
import { BackupDisclamerComponent } from "./backup-disclamer/backup-disclamer.component";
import { BackupPromptComponent } from "./backup-prompt/backup-prompt.component";
import { AccessRecoveryComponent } from "./access-recovery/access-recovery.component";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
    entryComponents: [
        LoginComponent,
        AvatarSelectComponent,
        RegisterComponent,
        BackupCreateComponent,
        BackupConfirmComponent,
        BackupPromptComponent,
        BackupDisclamerComponent,
        LoginComponent,
        AccessRecoveryComponent,
    ],
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
        LoginComponent,
        AvatarSelectComponent,
        RegisterComponent,
        BackupCreateComponent,
        BackupConfirmComponent,
        BackupPromptComponent,
        BackupDisclamerComponent,
        LoginComponent,
        AccessRecoveryComponent
    ],
    providers: [
        AuthenticationService,
        ModalService,
        CanActivateViaAuthGuard,
        CanActivateAccountAuthGuard,
    ]
})
export class AccountModule { } 
