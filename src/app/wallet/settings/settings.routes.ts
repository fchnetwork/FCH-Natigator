import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { SettingsBackupComponent } from '@app/wallet/settings/components/settingsBackup/settingsBackup.component';
import { SettingsGeneralComponent } from "@app/wallet/settings/components/settingsGeneral/settingsGeneral.component";
import { SettingsComponent } from '@app/wallet/settings/settings.component';
import { SettingsTokenComponent } from "@app/wallet/settings/components/settingsToken/settingsToken.component";
import { SettingsTransactionsComponent } from "@app/wallet/settings/components/settingsTransactions/settingsTransactions.component";
import { SettingsSystemComponent } from "@app/wallet/settings/components/settingsSystem/settingsSystem.component";

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(DIAGNOSTICS_ROUTES)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
