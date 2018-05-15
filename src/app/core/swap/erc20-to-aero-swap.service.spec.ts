import { TestBed, inject } from '@angular/core/testing';

import { Erc20ToAeroSwapService } from './erc20-to-aero-swap.service';

describe('Erc20ToAeroSwapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Erc20ToAeroSwapService]
    });
  });

  it('should be created', inject([Erc20ToAeroSwapService], (service: Erc20ToAeroSwapService) => {
    expect(service).toBeTruthy();
  }));
});
