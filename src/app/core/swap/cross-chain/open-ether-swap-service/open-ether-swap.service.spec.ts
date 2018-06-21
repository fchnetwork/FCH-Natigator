import { TestBed, inject } from '@angular/core/testing';

import { OpenEtherSwapService } from './open-ether-swap.service';

describe('OpenEtherSwapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenEtherSwapService]
    });
  });

  it('should be created', inject([OpenEtherSwapService], (service: OpenEtherSwapService) => {
    expect(service).toBeTruthy();
  }));
});
