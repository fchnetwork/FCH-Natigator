import { TestBed, inject } from '@angular/core/testing';

import { Erc20ToErc20SwapServiceService } from './erc20-to-erc20-swap-service.service';

describe('Erc20ToErc20SwapServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Erc20ToErc20SwapServiceService]
    });
  });

  it('should be created', inject([Erc20ToErc20SwapServiceService], (service: Erc20ToErc20SwapServiceService) => {
    expect(service).toBeTruthy();
  }));
});
