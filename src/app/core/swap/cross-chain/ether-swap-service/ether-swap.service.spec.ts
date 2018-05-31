import { TestBed, inject } from '@angular/core/testing';

import { EtherSwapService } from './ether-swap.service';

describe('EtherSwapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EtherSwapService]
    });
  });

  it('should be created', inject([EtherSwapService], (service: EtherSwapService) => {
    expect(service).toBeTruthy();
  }));
});
