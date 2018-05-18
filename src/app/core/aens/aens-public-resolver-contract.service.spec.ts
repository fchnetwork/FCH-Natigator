import { TestBed, inject } from '@angular/core/testing';

import { AensPublicResolverContractService } from './aens-public-resolver-contract.service';

describe('AensPublicResolverContractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AensPublicResolverContractService]
    });
  });

  it('should be created', inject([AensPublicResolverContractService], (service: AensPublicResolverContractService) => {
    expect(service).toBeTruthy();
  }));
});
