import { TestBed, inject } from '@angular/core/testing';

import Web3 from "web3";
import { AensFixedPriceRegistrarContractService } from './aens-fixed-price-registrar-contract.service';
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";

describe('AensFixedPriceRegistrarContractService', () => {
  const authService: Partial<AuthenticationService> = {
    getWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
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
