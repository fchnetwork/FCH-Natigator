import {Routes, RouterModule} from '@angular/router';
import { NgModule } from "@angular/core";
import { OverviewComponent } from './overview/overview.component';  
import { TestPageComponent } from '@app/wallet/diagnostics/test-page/test-page.component';

export const DIAGNOSTICS_ROUTES: Routes = [
  {
    path: '',
    component: OverviewComponent,
    children: [ 
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