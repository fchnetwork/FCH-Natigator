import { TestBed, inject } from '@angular/core/testing';

import { CounterErc20SwapService } from './counter-erc20-swap.service';

describe('CounterErc20SwapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CounterErc20SwapService]
    });
  });

  it('should be created', inject([CounterErc20SwapService], (service: CounterErc20SwapService) => {
    expect(service).toBeTruthy();
  }));
});
