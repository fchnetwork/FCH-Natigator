/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoadSwapService } from './load-swap.service';

describe('Service: LoadSwap', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadSwapService]
    });
  });

  it('should ...', inject([LoadSwapService], (service: LoadSwapService) => {
    expect(service).toBeTruthy();
  }));
});
