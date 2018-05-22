import { TestBed, inject } from '@angular/core/testing';

import Web3 from "web3";
import { AerumNameService } from './aerum-name.service';
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { AensRegistryContractService } from "@core/aens/aens-registry-contract-service/aens-registry-contract.service";
import { AensFixedPriceRegistrarContractService } from "@core/aens/aens-fixed-price-registrar-contract-service/aens-fixed-price-registrar-contract.service";
import { AensPublicResolverContractService } from "@core/aens/aens-public-resolver-contract-service/aens-public-resolver-contract.service";
import { LoggerService } from "@core/general/logger-service/logger.service";

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
        { provide: AensPublicResolverContractService, useValue: jest.fn() },
        { provide: LoggerService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([AerumNameService], (service: AerumNameService) => {
    expect(service).toBeTruthy();
  }));
});
