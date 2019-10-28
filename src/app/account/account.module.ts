import { RestoreAccountComponent } from '@app/account/restore-account/restore-account.component';
import { AccountRoutingModule } from "./account.routes";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppUIModule } from "../app.ui.module";
import { AvatarSelectComponent } from "./components/avatar-select/avatar-select.component";
import { PasswordLinesComponent } from "./components/password-lines/password-lines.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { MobileModule } from "@app/mobile/mobile.module";
import { RegisterComponent } from './register/register.component';
import { RegisterNameComponent } from './register-name/register-name.component';
import { BackupCreateComponent } from './backup-create/backup-create.component';
import { BackupConfirmComponent } from './backup-confirm/backup-confirm.component';
import { BackupDisclamerComponent } from "./backup-disclamer/backup-disclamer.component";
import { BackupPromptComponent } from "./backup-prompt/backup-prompt.component";
import { CoreModule } from "@app/core/core.module";
import { UnlockComponent } from "@app/account/unlock/unlock.component";

@NgModule({
    entryComponents: [
        UnlockComponent,
        AvatarSelectComponent,
        RegisterComponent,
        RegisterNameComponent,
        BackupCreateComponent,
        BackupConfirmComponent,
        BackupPromptComponent,
        BackupDisclamerComponent,
        PasswordLinesComponent
    ],
    imports: [
        AccountRoutingModule,
        AppUIModule,
        FormsModule,
        CommonModule,
        SharedModule,
        CoreModule,
        ReactiveFormsModule,
        MobileModule
    ],
    declarations: [
        UnlockComponent,
        AvatarSelectComponent,
        RegisterComponent,
        RegisterNameComponent,
        BackupCreateComponent,
        BackupConfirmComponent,
        BackupPromptComponent,
        BackupDisclamerComponent,
        PasswordLinesComponent,
        RestoreAccountComponent
    ]
})
export class AccountModule { }

