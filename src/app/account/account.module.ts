import { AccountRoutingModule } from "./account.routes";
import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { AppUIModule } from "../app.ui.module"; 
import { AvatarSelectComponent } from "./components/avatar-select/avatar-select.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastModule } from "ng2-toastr";
import { SharedModule } from "../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppRoutingModule } from "../app.routes";  
import { RegisterComponent } from './register/register.component';
import { BackupCreateComponent } from './backup-create/backup-create.component';
import { BackupConfirmComponent } from './backup-confirm/backup-confirm.component';
import { BackupDisclamerComponent } from "./backup-disclamer/backup-disclamer.component";
import { BackupPromptComponent } from "./backup-prompt/backup-prompt.component";
import { AccessRecoveryComponent } from "./access-recovery/access-recovery.component";
import { ExplorerModule } from "@app/wallet/explorer/explorer.module";
import { CoreModule } from "@app/core/core.module";
import { UnlockComponent } from "@app/account/unlock/unlock.component";

@NgModule({
    entryComponents: [
        UnlockComponent,
        AvatarSelectComponent,
        RegisterComponent,
        BackupCreateComponent,
        BackupConfirmComponent,
        BackupPromptComponent,
        BackupDisclamerComponent,
        AccessRecoveryComponent,
    ],
    imports: [
        AccountRoutingModule,
        AppUIModule,
        FormsModule,
        CommonModule,
        SharedModule,
        CoreModule,
        ReactiveFormsModule
    ],
    declarations: [
        UnlockComponent,
        AvatarSelectComponent,
        RegisterComponent,
        BackupCreateComponent,
        BackupConfirmComponent,
        BackupPromptComponent,
        BackupDisclamerComponent, 
        AccessRecoveryComponent
    ]
})
export class AccountModule { } 
