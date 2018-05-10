import { RouterModule, PreloadAllModules } from "@angular/router";
import { NgModule } from "@angular/core"; 
import { CanActivateViaAuthGuard } from "@app/core/auth-guards/can-activate-auth.guard";


export const ROUTES = [
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
    canActivate: [CanActivateViaAuthGuard],
    loadChildren: 'app/wallet/wallet.module#WalletModule'
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
