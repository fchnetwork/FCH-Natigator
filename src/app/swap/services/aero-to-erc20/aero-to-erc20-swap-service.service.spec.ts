import { TestBed, inject } from '@angular/core/testing';

import { AeroToErc20SwapServiceService } from './aero-to-erc20-swap-service.service';

describe('EtherToErc20SwapServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AeroToErc20SwapServiceService]
    });
  });

  it('should be created', inject([AeroToErc20SwapServiceService], (service: AeroToErc20SwapServiceService) => {
    expect(service).toBeTruthy();
  }));
});
