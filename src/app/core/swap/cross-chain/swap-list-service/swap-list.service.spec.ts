import { TestBed, inject } from '@angular/core/testing';

import { SwapListService } from './swap-list.service';

describe('SwapListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwapListService]
    });
  });

  it('should be created', inject([SwapListService], (service: SwapListService) => {
    expect(service).toBeTruthy();
  }));
});
