import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";  
import { RegisterComponent } from "./register/register.component";
import { BackupDisclamerComponent } from "./backup-disclamer/backup-disclamer.component";
import { BackupCreateComponent } from "./backup-create/backup-create.component"; 
import { RegistrationRouteData } from "./models/RegistrationRouteData";
import { BackupPromptComponent } from "./backup-prompt/backup-prompt.component";
import { BackupConfirmComponent } from "./backup-confirm/backup-confirm.component"; 
import { AccessRecoveryComponent } from "./access-recovery/access-recovery.component"; 
import { UnlockComponent } from "@app/account/unlock/unlock.component"; 
import { CanActivateAccountAuthGuard } from "@app/core/authentication/auth-guards/can-activate-account.guard";

const ACCOUNT_ROUTES = [
    {
        path: '',
        children: [
            {
                path: '', 
                redirectTo: 'unlock',
                pathMatch: 'full'
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'backup',
                component: BackupPromptComponent
            },
            {
                path: 'backup/create',
                component: BackupCreateComponent
            }, 
            {
                path: 'backup/confirm',
                component: BackupConfirmComponent
            },
            {
                path: 'unlock',
                canActivate: [CanActivateAccountAuthGuard],
                component: UnlockComponent
            },
            {
                path: 'restore',
                component: AccessRecoveryComponent
            }
        ] 
    }
];

@NgModule({
    imports: [RouterModule.forChild(ACCOUNT_ROUTES)], 
    exports: [RouterModule]
})
export class AccountRoutingModule { }