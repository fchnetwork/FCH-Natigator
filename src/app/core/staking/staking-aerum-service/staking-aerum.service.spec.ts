/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StakingAerumService } from './staking-aerum.service';

describe('Service: StakingAerum', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StakingAerumService]
    });
  });

  it('should ...', inject([StakingAerumService], (service: StakingAerumService) => {
    expect(service).toBeTruthy();
  }));
});
