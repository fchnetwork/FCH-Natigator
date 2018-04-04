
import { LoginComponent } from './account/login/login.component'
import { RegistrationComponent } from './account/registration/registration.component'
import { Error404Component } from './shared/components/error404/error404.component'
import { LandingPageComponent } from './account/landing-page/landing-page.component'
import { CreateTransactionComponent } from './account/createTransaction/createTransaction.component'
import { CanActivateViaAuthGuard } from './app.guard';
import { BackupConfirmationComponent } from './account/backup-confirmation/backup-confirmation.component';
import { BackupDisclamerComponent } from './account/backup-disclamer/backup-disclamer.component';

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
      path: 'login',
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
    path: '**',
    redirectTo: '/not-found'
  }
]
