import { TestBed, inject } from '@angular/core/testing';

import { AeroToErc20SwapService } from './aero-to-erc20-swap.service';

describe('EtherToErc20SwapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AeroToErc20SwapService]
    });
  });

  it('should be created', inject([AeroToErc20SwapService], (service: AeroToErc20SwapService) => {
    expect(service).toBeTruthy();
  }));
});
