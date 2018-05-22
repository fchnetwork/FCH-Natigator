import { TestBed, inject } from '@angular/core/testing';

import { AensPublicResolverContractService } from './aens-public-resolver-contract.service';
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@app/core/contract/contract-executor.service";
import Web3 from "web3";

describe('AensPublicResolverContractService', () => {
  const authService: Partial<AuthenticationService> = {
    initWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AensPublicResolverContractService,
        { provide: AuthenticationService, useValue: authService },
        { provide: ContractExecutorService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([AensPublicResolverContractService], (service: AensPublicResolverContractService) => {
    expect(service).toBeTruthy();
  }));
});
