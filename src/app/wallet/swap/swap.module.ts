import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module';

import { CreateSwapComponent } from './components/create-swap/create-swap.component';
import { LoadSwapComponent } from './components/load-swap/load-swap.component';
import { CreateSwapConfirmComponent } from './components/create-swap/create-swap-confirm/create-swap-confirm.component';
import { LoadSwapConfirmComponent } from './components/load-swap/load-swap-confirm/load-swap-confirm.component';
import { SwapTokensListComponent } from './components/create-swap/swap-tokens-list/swap-tokens-list.component';
import { SwapRoutingModule } from '@app/wallet/swap/swap.routes';
import { CoreModule } from '@app/core/core.module';
import { SwapDashboardComponent } from './components/swap-dashboard/swap-dashboard.component';
import { OnChainSwapListComponent } from './components/on-chain-swap-list/on-chain-swap-list.component';
import { CrossChainSwapListComponent } from './components/cross-chain-swap-list/cross-chain-swap-list.component';

@NgModule({
  entryComponents: [
    CreateSwapComponent,
    CreateSwapConfirmComponent,
    LoadSwapConfirmComponent,
    SwapDashboardComponent
  ],
  imports: [
    FormsModule,
    AppUIModule,
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    SharedModule,
    SwapRoutingModule
  ],
  declarations: [
    CreateSwapComponent,
    LoadSwapComponent,
    CreateSwapConfirmComponent,
    LoadSwapConfirmComponent,
    SwapTokensListComponent,
    SwapDashboardComponent,
    OnChainSwapListComponent,
    CrossChainSwapListComponent
  ],
  exports: [
    CreateSwapComponent,
    CreateSwapConfirmComponent,
    LoadSwapConfirmComponent
  ]
})
export class SwapModule { }
