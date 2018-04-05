import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { RegistrationComponent } from "./registration/registration.component";
import { LoginComponent } from "./login/login.component"; 
import { RegisterComponent } from "./register/register.component";
import { BackupDisclamerComponent } from "./backup-disclamer/backup-disclamer.component";
import { BackupCreateComponent } from "./backup-create/backup-create.component";
import { BackupConfirmationComponent } from "./backup-confirmation/backup-confirmation.component";

export const ACCOUNT_ROUTES = [
    {
        path: '',
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
                component: BackupDisclamerComponent
            },
            {
                path: 'backup/create',
                component: BackupCreateComponent
            },
            {
                path: 'backup/confirm',
                component: BackupConfirmationComponent
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