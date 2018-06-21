import { TestBed, inject } from '@angular/core/testing';

import { CounterAerumErc20SwapService } from './counter-aerum-erc20-swap.service';
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";
import Web3 from "web3";

describe('CounterAerumErc20SwapService', () => {
  const authService: Partial<AuthenticationService> = {
    getWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CounterAerumErc20SwapService,
        { provide: AuthenticationService, useValue: authService },
        { provide: ContractExecutorService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([CounterAerumErc20SwapService], (service: CounterAerumErc20SwapService) => {
    expect(service).toBeTruthy();
  }));
});
