import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { WalletComponent } from './wallet.component'; 

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
                loadChildren: 'app/wallet/home/home.module#HomeModule'
            },
            {
                path: 'swap',
                loadChildren: 'app/wallet/swap/swap.module#SwapModule',
                data: { sidebarGroup: 'swap'}
            },
            {
                path: 'transaction',
                loadChildren: 'app/wallet/transaction/transaction.module#TransactionModule'
            },
            {
                path: 'explorer',
                loadChildren: 'app/wallet/explorer/explorer.module#ExplorerModule',
                data: { sidebarGroup: 'explorer'}
            },
            {
                path: 'aens',
                loadChildren: 'app/wallet/aens/aens.module#AensModule'
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(WALLET_ROUTES)], 
    exports: [RouterModule]
  })
  export class WalletRoutingModule { }