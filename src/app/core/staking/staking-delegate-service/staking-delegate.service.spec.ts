/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StakingDelegateService } from './staking-delegate.service';

describe('Service: StakingDelegate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StakingDelegateService]
    });
  });

  it('should ...', inject([StakingDelegateService], (service: StakingDelegateService) => {
    expect(service).toBeTruthy();
  }));
});
