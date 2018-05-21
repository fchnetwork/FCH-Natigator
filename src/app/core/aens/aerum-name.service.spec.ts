import { TestBed, inject } from '@angular/core/testing';

import { AerumNameService } from './aerum-name.service';
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { AensRegistryContractService } from "@app/core/aens/aens-registry-contract.service";
import { AensFixedPriceRegistrarContractService } from "@app/core/aens/aens-fixed-price-registrar-contract.service";
import { AensPublicResolverContractService } from "@app/core/aens/aens-public-resolver-contract.service";
import Web3 from "web3";

describe('AerumNameService', () => {
  const authService: Partial<AuthenticationService> = {
    initWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AerumNameService,
        { provide: AuthenticationService, useValue: authService },
        { provide: AensRegistryContractService, useValue: jest.fn() },
        { provide: AensFixedPriceRegistrarContractService, useValue: jest.fn() },
        { provide: AensPublicResolverContractService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([AerumNameService], (service: AerumNameService) => {
    expect(service).toBeTruthy();
  }));
});
