import {Routes, RouterModule} from '@angular/router';
import { NgModule } from "@angular/core";
import { OverviewComponent } from './overview/overview.component'; 
import { LoggedInComponent } from '@app/wallet/logged-in/logged-in.component';
import { TestPageComponent } from '@app/wallet/diagnostics/test-page/test-page.component';

export const DIAGNOSTICS_ROUTES: Routes = [
  {
    path: '',
    component: LoggedInComponent,
    children: [
      {
        path: '',
        component: OverviewComponent
      },
      {
        path: 'stats',
        component: TestPageComponent
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(DIAGNOSTICS_ROUTES)],
  exports: [RouterModule]
})
export class DiagnosticsRoutingModule { }