/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StakingLocalStorageService } from './staking-local-storage.service';

describe('Service: StakingLocalStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StakingLocalStorageService]
    });
  });

  it('should ...', inject([StakingLocalStorageService], (service: StakingLocalStorageService) => {
    expect(service).toBeTruthy();
  }));
});
