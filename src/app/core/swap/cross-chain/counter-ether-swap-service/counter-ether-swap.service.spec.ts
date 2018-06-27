import { TestBed, inject } from '@angular/core/testing';

import { CounterEtherSwapService } from './counter-ether-swap.service';

describe('CounterEtherSwapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CounterEtherSwapService]
    });
  });

  it('should be created', inject([CounterEtherSwapService], (service: CounterEtherSwapService) => {
    expect(service).toBeTruthy();
  }));
});
