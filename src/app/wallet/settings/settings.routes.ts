import { SettingsImportWalletComponent } from './components/settings-import-wallet/settings-import-wallet.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { SettingsBackupComponent } from "@app/wallet/settings/components/settings-backup/settings-backup.component";
import { SettingsGeneralComponent } from "@app/wallet/settings/components/settings-general/settings-general.component";
import { SettingsTokenComponent } from "@app/wallet/settings/components/settings-token/settings-token.component";
import { SettingsTransactionsComponent } from "@app/wallet/settings/components/settings-transactions/settings-transactions.component";
import { SettingsSystemComponent } from "@app/wallet/settings/components/settings-system/settings-system.component";
import { SettingsEthereumWalletComponent } from "@app/wallet/settings/components/settings-ethereum-wallet/settings-ethereum-wallet.component";
import { SettingsComponent } from '@app/wallet/settings/settings.component';

export const DIAGNOSTICS_ROUTES: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
      },
      {
        path: 'general',
        component: SettingsGeneralComponent
      },
      {
        path: 'token',
        component: SettingsTokenComponent
      },
      {
        path: 'backup',
        component: SettingsBackupComponent
      },
      {
        path: 'transactions',
        component: SettingsTransactionsComponent
      },
      {
        path: 'system',
        component: SettingsSystemComponent
      },
      {
        path: 'ethereum-wallet',
        component: SettingsEthereumWalletComponent
      },
      {
        path: 'import-wallet',
        component: SettingsImportWalletComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(DIAGNOSTICS_ROUTES)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
