import { AensModule } from './aens/aens.module';
import { HomeModule } from './home/home.module';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { WalletComponent } from './wallet.component';
import { TransactionModule } from '@app/wallet/transaction/transaction.module';
import { ExplorerModule } from '@app/wallet/explorer/explorer.module';
import { SettingsModule } from '@app/wallet/settings/settings.module';
import { SwapModule } from '@app/wallet/swap/swap.module';
import { StakingModule } from '@app/wallet/staking/staking.module';

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
                loadChildren: () => HomeModule
            },
            {
                path: 'swap',
                loadChildren: () => SwapModule,
                data: { sidebarGroup: 'swap'}
            },
            {
                path: 'transaction',
                loadChildren: () => TransactionModule
            },
            {
                path: 'explorer',
                loadChildren: () => ExplorerModule,
                data: { sidebarGroup: 'explorer'}
            },
            {
                path: 'aens',
                loadChildren: () => AensModule
            },
            {
                path: 'staking',
                loadChildren: () => StakingModule
            },
            {
                path: 'settings',
                loadChildren: () => SettingsModule
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(WALLET_ROUTES)],
    exports: [RouterModule]
  })
  export class WalletRoutingModule { }
