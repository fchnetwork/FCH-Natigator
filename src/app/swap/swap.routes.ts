import {Routes, RouterModule} from '@angular/router';
import { NgModule } from "@angular/core";
import { LoggedInComponent } from '@app/logged-in/logged-in.component';

import { CreateSwapComponent } from '@app/swap/components/create-swap/create-swap.component';
import { LoadSwapComponent } from '@app/swap/components/load-swap/load-swap.component';

export const SWAP_ROUTES: Routes = [{
path: '',
component: LoggedInComponent,
children: [
    {
      path: 'create',
      component: CreateSwapComponent,
    },
    {
      path: 'load',
      component: LoadSwapComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(SWAP_ROUTES)],
  exports: [RouterModule]
})
export class SwapRoutingModule { }