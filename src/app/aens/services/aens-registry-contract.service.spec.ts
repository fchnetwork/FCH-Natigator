import { TestBed, inject } from '@angular/core/testing';

import { AensRegistryContractService } from './aens-registry-contract.service';

describe('AensRegistryContractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AensRegistryContractService]
    });
  });

  it('should be created', inject([AensRegistryContractService], (service: AensRegistryContractService) => {
    expect(service).toBeTruthy();
  }));
});
