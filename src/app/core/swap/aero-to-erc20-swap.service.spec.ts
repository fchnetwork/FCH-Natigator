import { TestBed, inject } from '@angular/core/testing';

import Web3 from "web3";
import { AeroToErc20SwapService } from './aero-to-erc20-swap.service';
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@app/core/contract/contract-executor.service";

describe('EtherToErc20SwapService', () => {
  const authService: Partial<AuthenticationService> = {
    initWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AeroToErc20SwapService,
        { provide: AuthenticationService, useValue: authService },
        { provide: ContractExecutorService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([AeroToErc20SwapService], (service: AeroToErc20SwapService) => {
    expect(service).toBeTruthy();
  }));
});
