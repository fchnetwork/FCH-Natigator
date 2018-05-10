import { TestBed, inject } from '@angular/core/testing';

import { AenRegistryContractService } from './aen-registry-contract.service';

describe('AenRegistryContractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AenRegistryContractService]
    });
  });

  it('should be created', inject([AenRegistryContractService], (service: AenRegistryContractService) => {
    expect(service).toBeTruthy();
  }));
});
