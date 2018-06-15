import { TestBed, inject } from '@angular/core/testing';

import { AeroSwapService } from './aero-swap.service';
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";
import Web3 from "web3";

describe('AeroSwapService', () => {
  const authService: Partial<AuthenticationService> = {
    getWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AeroSwapService,
        { provide: AuthenticationService, useValue: authService },
        { provide: ContractExecutorService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([AeroSwapService], (service: AeroSwapService) => {
    expect(service).toBeTruthy();
  }));
});
