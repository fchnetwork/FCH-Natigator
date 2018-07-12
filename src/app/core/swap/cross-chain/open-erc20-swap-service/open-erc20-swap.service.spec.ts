import { TestBed, inject } from '@angular/core/testing';

import { OpenErc20SwapService } from './open-erc20-swap.service';

describe('OpenErc20SwapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenErc20SwapService]
    });
  });

  it('should be created', inject([OpenErc20SwapService], (service: OpenErc20SwapService) => {
    expect(service).toBeTruthy();
  }));
});
