import { NgModule, ModuleWithProviders } from '@angular/core';
import { FingerPrintService } from './finger-print/finger-print.service';

@NgModule({
  providers: [
    FingerPrintService
  ]
})
export class MobileModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MobileModule,
    };
  }
}
