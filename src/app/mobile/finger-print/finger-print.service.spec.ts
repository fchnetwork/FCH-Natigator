/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FingerPrintService } from '@app/mobile/finger-print/finger-print.service';

describe('Service: FingerPrintService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FingerPrintService]
    });
  });

  it('should ...', inject([FingerPrintService], (service: FingerPrintService) => {
    expect(service).toBeTruthy();
  }));
});
