import { AuthenticationGuard } from './core/authentication/auth-guards/authentication.guard';
import { RouterModule, PreloadAllModules } from "@angular/router";
import { NgModule } from "@angular/core";
import { CanActivateViaAuthGuard } from "@app/core/authentication/auth-guards/can-activate-auth.guard";

const ROUTES = [
  {
    path: '',
    redirectTo: 'wallet',
    pathMatch: 'full'
  },
  // TO PREVENT LAZY LOADING OF COMPONENTS ACCESSIBLE IMMEDIATELY AFTER LOAD
  {
    path: 'account',
    loadChildren: 'app/account/account.module#AccountModule'
  },
  {
    path: 'wallet',
    canActivate: [AuthenticationGuard],
    loadChildren: 'app/wallet/wallet.module#WalletModule'
  },
  {
    path: 'external',
    canActivate: [AuthenticationGuard],
    loadChildren: 'app/external/external.module#ExternalModule'
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
