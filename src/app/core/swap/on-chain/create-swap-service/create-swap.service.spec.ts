/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CreateSwapService } from './create-swap.service';

describe('Service: CreateSwap', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateSwapService]
    });
  });

  it('should ...', inject([CreateSwapService], (service: CreateSwapService) => {
    expect(service).toBeTruthy();
  }));
});
