
import { LoginComponent } from './account/login/login.component'
import { RegistrationComponent } from './account/registration/registration.component'
import { Error404Component } from './shared/components/error404/error404.component'
import { LandingPageComponent } from './account/landing-page/landing-page.component'
import { CreateTransactionComponent } from './account/create-transaction/create-transaction.component'
import { CanActivateViaAuthGuard } from './app.guard';
import { BackupConfirmationComponent } from './account/backup-confirmation/backup-confirmation.component';
import { BackupDisclamerComponent } from './account/backup-disclamer/backup-disclamer.component';
import { BackupCreateComponent } from './account/backup-create/backup-create.component';
import { BackupConfirmComponent } from './account/backup-confirm/backup-confirm.component';
import { AccessRecoveryComponent } from './account/access-recovery/access-recovery.component';

export const ROUTES = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
      path: 'landing',
      component: LandingPageComponent
  },    
  {
      path: 'account/login',
      component: LoginComponent
  },
  {
    path: 'transaction',
    component: CreateTransactionComponent,
    canActivate: [CanActivateViaAuthGuard]
},  
  {
      path: 'create',
      component: RegistrationComponent
  },
  {
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
    path: 'recovery',
    component: AccessRecoveryComponent
  },
  { 
    path: '**',
    redirectTo: '/not-found'
  }
]
