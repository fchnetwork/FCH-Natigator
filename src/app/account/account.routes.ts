import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core"; 
import { LoginComponent } from "./login/login.component"; 
import { RegisterComponent } from "./register/register.component";
import { BackupDisclamerComponent } from "./backup-disclamer/backup-disclamer.component";
import { BackupCreateComponent } from "./backup-create/backup-create.component"; 
import { RegistrationRouteData } from "./models/RegistrationRouteData";
import { BackupPromptComponent } from "./backup-prompt/backup-prompt.component";
import { BackupConfirmComponent } from "./backup-confirm/backup-confirm.component"; 
import { AccessRecoveryComponent } from "./access-recovery/access-recovery.component";

export const ACCOUNT_ROUTES = [
    {
        path: '',
        children: [
            {
                path: '', 
                redirectTo: 'login',
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
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'restore',
                component: AccessRecoveryComponent
            }
        ] 
    }
]

@NgModule({
    imports: [RouterModule.forChild(ACCOUNT_ROUTES)], 
    exports: [RouterModule]
})
export class AccountRoutingModule { }