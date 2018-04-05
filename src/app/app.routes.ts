
import { LoginComponent } from './account/login/login.component'
import { RegistrationComponent } from './account/registration/registration.component'
import { Error404Component } from './shared/components/error404/error404.component' 
import { CanActivateViaAuthGuard } from './app.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './account/register/register.component';
import { BackupConfirmationComponent } from './account/backup-confirmation/backup-confirmation.component';
import { BackupDisclamerComponent } from './account/backup-disclamer/backup-disclamer.component';
import { BackupCreateComponent } from './account/backup-create/backup-create.component';
import { BackupConfirmComponent } from './account/backup-confirm/backup-confirm.component';
import { AccountModule } from './account/account.module';

export const ROUTES = [
  {
    path: '',
    redirectTo: 'account',
    canActivate: [CanActivateViaAuthGuard],
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadChildren: () => AccountModule
  },
  {
    // path: 'dashboard',
    // component: DashboardComponent
    path: 'explorer',
    loadChildren: './explorer/explorer.module#ExplorerModule'
  },
  {
    path: 'not-found',
    component: Error404Component,
  },
  {
    path: 'backup-confirmation',
    component: BackupConfirmationComponent
  },
  {
    path: 'backup-disclamer',
    component: BackupDisclamerComponent
  },
  {
    path: 'backup-create',
    component: BackupCreateComponent
  },
  {
    path: 'backup-confirm',
    component: BackupConfirmComponent
  },
  { 
    path: '**',
    redirectTo: '/not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
