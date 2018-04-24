
import { LoginComponent } from './account/login/login.component';
import { Error404Component } from './shared/components/error404/error404.component';
import { CreateTransactionComponent } from './transaction/create-transaction/create-transaction.component';
import { CanActivateViaAuthGuard } from './app.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './account/register/register.component'; 
import { BackupDisclamerComponent } from './account/backup-disclamer/backup-disclamer.component';
import { BackupCreateComponent } from './account/backup-create/backup-create.component';
import { BackupConfirmComponent } from './account/backup-confirm/backup-confirm.component';
import { AccountModule } from './account/account.module';
import { BackupPromptComponent } from './account/backup-prompt/backup-prompt.component';
import { ACCOUNT_ROUTES } from './account/account.routes';
import { DASHBOARD_ROUTES } from './dashboard/dashboard.routes';
import { ExplorerModule } from '@explorer/explorer.module';
import { EXPLORER_ROUTES } from './explorer/explorer.routes';
import { DIAGNOSTICS_ROUTES } from './diagnostics/diagnostics.routes';

export const ROUTES = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  // TO PREVENT LAZY LOADING OF COMPONENTS ACCESSIBLE IMMEDIATELY AFTER LOAD
  {
    path: 'account',
    children: ACCOUNT_ROUTES
  },
  {
    path: 'explorer',
    children: EXPLORER_ROUTES
  },
  {
    path: 'dashboard',
    canActivate: [CanActivateViaAuthGuard],
    children: DASHBOARD_ROUTES
  },
  // TODO: handle 404 with correct routing and views
  // {
  //   path: 'not-found',
  //   component: Error404Component,
  // },
  {
    path: 'backup-confirmation',
    component: BackupPromptComponent
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
    path: 'transaction',
    canActivate: [CanActivateViaAuthGuard], // leave this here!!!
    component: CreateTransactionComponent,
  },
  {
    path: 'diagnostics',
    children: DIAGNOSTICS_ROUTES
  },  
  { 
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
