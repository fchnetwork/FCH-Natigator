import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { WalletComponent } from './wallet.component';
import { CanActivateViaAuthGuard } from "@app/core/auth-guards/can-activate-auth.guard";

export const WALLET_ROUTES = [ 
    {
        path: '',
        component: WalletComponent,
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadChildren: 'home/home.module#HomeModule'
            },
            {
                path: 'swap',
                loadChildren: 'swap/swap.module#SwapModule'
            },
            {
                path: 'transaction',
                loadChildren: 'transaction/transaction.module#TransactionModule'
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(WALLET_ROUTES)], 
    exports: [RouterModule]
  })
  export class WalletRoutingModule { }