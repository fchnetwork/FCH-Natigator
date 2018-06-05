import { TestBed, inject } from '@angular/core/testing';

import Web3 from "web3";
import { Erc20ToErc20SwapService } from './erc20-to-erc20-swap.service';
import { AuthenticationService } from "../../../authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "../../../contract/contract-executor-service/contract-executor.service";

describe('Erc20ToErc20SwapService', () => {
  const authService: Partial<AuthenticationService> = {
    initWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Erc20ToErc20SwapService,
        { provide: AuthenticationService, useValue: authService },
        { provide: ContractExecutorService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([Erc20ToErc20SwapService], (service: Erc20ToErc20SwapService) => {
    expect(service).toBeTruthy();
  }));
});
