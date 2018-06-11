import {Routes, RouterModule} from '@angular/router';
import { NgModule } from "@angular/core";
import { SettingsBackupComponent } from '@app/wallet/settings/components/settingsBackup/settingsBackup.component';
import { SettingsComponent } from '@app/wallet/settings/components/settings/settings.component';

export const DIAGNOSTICS_ROUTES: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'backup',
        component: SettingsBackupComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(DIAGNOSTICS_ROUTES)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
