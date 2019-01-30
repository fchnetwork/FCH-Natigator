import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { RegisterComponent } from "./register/register.component";
import { RegisterNameComponent } from "./register-name/register-name.component";
import { BackupCreateComponent } from "./backup-create/backup-create.component";
import { BackupPromptComponent } from "./backup-prompt/backup-prompt.component";
import { BackupConfirmComponent } from "./backup-confirm/backup-confirm.component";
import { UnlockComponent } from "@app/account/unlock/unlock.component";
import { RestoreAccountComponent } from "@app/account/restore-account/restore-account.component";

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
                path: 'register-name',
                component: RegisterNameComponent
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
                component: UnlockComponent
            },
            {
                path: 'restore',
                component: RestoreAccountComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(ACCOUNT_ROUTES)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
