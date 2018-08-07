import { TestBed, inject } from '@angular/core/testing';

import { MobileQrScannerService } from './mobile-qr-scanner.service';

describe('MobileQrScannerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MobileQrScannerService]
    });
  });

  it('should be created', inject([MobileQrScannerService], (service: MobileQrScannerService) => {
    expect(service).toBeTruthy();
  }));
});
