
import { LoginComponent } from './account/login/login.component';
import { Error404Component } from './shared/components/error404/error404.component'; 
import { CanActivateViaAuthGuard } from './app.guard';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './account/register/register.component'; 
import { BackupDisclamerComponent } from './account/backup-disclamer/backup-disclamer.component';
import { BackupCreateComponent } from './account/backup-create/backup-create.component';
import { BackupConfirmComponent } from './account/backup-confirm/backup-confirm.component';
import { AccountModule } from './account/account.module';
import { BackupPromptComponent } from './account/backup-prompt/backup-prompt.component';
import { ACCOUNT_ROUTES } from './account/account.routes'; 
import { EXPLORER_ROUTES } from '@app/wallet/explorer/explorer.routes';
import { DASHBOARD_ROUTES } from '@app/wallet/dashboard/dashboard.routes';
import { TRANSACTION_ROUTES } from '@app/wallet/transaction/transaction.routes';
import { DIAGNOSTICS_ROUTES } from '@app/wallet/diagnostics/diagnostics.routes';
import { SWAP_ROUTES } from '@app/wallet/swap/swap.routes';

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
  {
    path: 'not-found',
    component: Error404Component,
  }, 
  {
    path: 'transaction',
    canActivate: [CanActivateViaAuthGuard], // leave this here!!!
    children: TRANSACTION_ROUTES,
  },
  {
    path: 'diagnostics',
    children: DIAGNOSTICS_ROUTES
  },  
  {
    path: 'swap',
    canActivate: [CanActivateViaAuthGuard], // NOTE: Use the same guard as transactions
    children: SWAP_ROUTES
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
