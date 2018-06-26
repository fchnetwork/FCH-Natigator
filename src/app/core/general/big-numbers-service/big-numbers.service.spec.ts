/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BigNumbersService } from './big-numbers.service';

describe('Service: BigNumbers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BigNumbersService]
    });
  });

  it('should ...', inject([BigNumbersService], (service: BigNumbersService) => {
    expect(service).toBeTruthy();
  }));
});
