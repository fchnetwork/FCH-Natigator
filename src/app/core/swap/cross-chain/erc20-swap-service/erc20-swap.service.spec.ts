import { TestBed, inject } from '@angular/core/testing';

import { Erc20SwapService } from './erc20-swap.service';

describe('Erc20SwapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Erc20SwapService]
    });
  });

  it('should be created', inject([Erc20SwapService], (service: Erc20SwapService) => {
    expect(service).toBeTruthy();
  }));
});
