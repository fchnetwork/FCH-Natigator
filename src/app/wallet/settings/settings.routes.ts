import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { SettingsBackupComponent } from '@app/wallet/settings/components/settingsBackup/settingsBackup.component';
import { SettingsGeneralComponent } from "@app/wallet/settings/components/settingsGeneral/settingsGeneral.component";
import { SettingsComponent } from '@app/wallet/settings/settings.component';
import { SettingsTokenComponent } from "@app/wallet/settings/components/settingsToken/settingsToken.component";

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(DIAGNOSTICS_ROUTES)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
