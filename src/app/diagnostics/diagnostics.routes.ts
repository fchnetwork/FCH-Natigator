import {Routes, RouterModule} from '@angular/router';
import { NgModule } from "@angular/core";
import { OverviewComponent } from './overview/overview.component';
import { TestPageComponent } from '@diagnostics/test-page/test-page.component';
import { LoggedInComponent } from '@app/logged-in/logged-in.component';

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