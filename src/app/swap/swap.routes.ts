import {Routes, RouterModule} from '@angular/router';
import { NgModule } from "@angular/core";
import { LoggedInComponent } from '@app/logged-in/logged-in.component';

import { AeroToErc20Component } from '@app/swap/components/aero-to-erc20/aero-to-erc20.component';
import { Erc20ToAeroComponent } from '@app/swap/components/erc20-to-aero/erc20-to-aero.component';
import { Erc20ToErc20Component } from '@app/swap/components/erc20-to-erc20/erc20-to-erc20.component';

export const SWAP_ROUTES: Routes = [{
path: '',
component: LoggedInComponent,
children: [
    {
      path: 'aero-to-erc20',
      component: AeroToErc20Component,
    },
    {
      path: 'erc20-to-aero',
      component: Erc20ToAeroComponent,
    },
    {
      path: 'erc20-to-erc20',
      component: Erc20ToErc20Component,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(SWAP_ROUTES)],
  exports: [RouterModule]
})
export class SwapRoutingModule { }