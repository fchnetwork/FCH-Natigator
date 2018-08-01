/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StakingGovernanceService } from './staking-governance.service';

describe('Service: StakingGovernance', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StakingGovernanceService]
    });
  });

  it('should ...', inject([StakingGovernanceService], (service: StakingGovernanceService) => {
    expect(service).toBeTruthy();
  }));
});
