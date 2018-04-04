import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { RegistrationComponent } from "./registration/registration.component";
import { LoginComponent } from "./login/login.component";
import { BackupComponent } from "./backup/backup.component";
import { BackupCreateComponent } from "./backup-create/backup-create.component";
import { BackupConfirmComponent } from "./backup-confirm/backup-confirm.component";
import { RegisterComponent } from "./register/register.component";

export const ACCOUNT_ROUTES = [
    {
        path: 'account',
        compoonent: RegisterComponent,
        children: [
            {
                path: '', 
                redirectTo: 'register',
                pathMatch: 'full'
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'registration',
                component: RegistrationComponent
            },
            {
                path: 'backup',
                component: BackupComponent
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
            }
        ] 
    }
]

@NgModule({
    imports: [RouterModule.forChild(ACCOUNT_ROUTES)], 
    exports: [RouterModule]
})
export class AccountRoutingModule { }