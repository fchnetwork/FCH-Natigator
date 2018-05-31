import { TestBed, inject } from '@angular/core/testing';

import { EtherErc20SwapService } from './ether-erc20-swap.service';
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";
import Web3 from "web3";

describe('EtherErc20SwapService', () => {
  beforeEach(() => {
    const authService: Partial<AuthenticationService> = {
      initWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
    };

    TestBed.configureTestingModule({
      providers: [
        EtherErc20SwapService,
        { provide: AuthenticationService, useValue: authService },
        { provide: ContractExecutorService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([EtherErc20SwapService], (service: EtherErc20SwapService) => {
    expect(service).toBeTruthy();
  }));
});
