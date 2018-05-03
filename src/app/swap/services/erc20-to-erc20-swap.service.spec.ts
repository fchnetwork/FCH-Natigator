import { TestBed, inject } from '@angular/core/testing';

import { Erc20ToErc20SwapService } from './erc20-to-erc20-swap.service';

describe('Erc20ToErc20SwapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Erc20ToErc20SwapService]
    });
  });

  it('should be created', inject([Erc20ToErc20SwapService], (service: Erc20ToErc20SwapService) => {
    expect(service).toBeTruthy();
  }));
});
