import { NgModule, ModuleWithProviders } from '@angular/core';
import { FingerPrintService } from './finger-print/finger-print.service';
import { UniversalLinkService } from './universal-link/universal-link.service';

@NgModule({
  providers: [
    FingerPrintService,
    UniversalLinkService
  ]
})
export class MobileModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MobileModule,
    };
  }
}
