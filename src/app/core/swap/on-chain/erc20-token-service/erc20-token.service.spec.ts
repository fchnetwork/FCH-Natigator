import { TestBed, inject } from '@angular/core/testing';

import Web3 from "web3";
import { ERC20TokenService } from './erc20-token.service';
import { AuthenticationService } from "../../../authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "../../../contract/contract-executor-service/contract-executor.service";

describe('ERC20TokenService', () => {
  beforeEach(() => {
    const authService: Partial<AuthenticationService> = {
      initWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
    };

    TestBed.configureTestingModule({
      providers: [
        ERC20TokenService,
        { provide: AuthenticationService, useValue: authService },
        { provide: ContractExecutorService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([ERC20TokenService], (service: ERC20TokenService) => {
    expect(service).toBeTruthy();
  }));
});
