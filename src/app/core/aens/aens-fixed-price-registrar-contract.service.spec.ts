import { TestBed, inject } from '@angular/core/testing';

import { AensFixedPriceRegistrarContractService } from './aens-fixed-price-registrar-contract.service';
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@app/core/contract/contract-executor.service";
import Web3 from "web3";

describe('AensFixedPriceRegistrarContractService', () => {
  const authService: Partial<AuthenticationService> = {
    initWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AensFixedPriceRegistrarContractService,
        { provide: AuthenticationService, useValue: authService },
        { provide: ContractExecutorService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([AensFixedPriceRegistrarContractService], (service: AensFixedPriceRegistrarContractService) => {
    expect(service).toBeTruthy();
  }));
});
