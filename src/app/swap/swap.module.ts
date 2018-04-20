import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AeroToErc20SwapServiceService } from '@app/swap/services/aero-to-erc20/aero-to-erc20-swap-service.service';
import { Erc20ToErc20SwapServiceService } from '@app/swap/services/erc20-to-erc20/erc20-to-erc20-swap-service.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    AeroToErc20SwapServiceService,
    Erc20ToErc20SwapServiceService
  ]
})
export class SwapModule { }