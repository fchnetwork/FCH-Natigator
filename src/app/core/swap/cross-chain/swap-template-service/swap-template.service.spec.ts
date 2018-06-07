import { TestBed, inject } from '@angular/core/testing';

import { SwapTemplateService } from './swap-template.service';
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";
import Web3 from "web3";

describe('SwapTemplateService', () => {
  beforeEach(() => {
    const authService: Partial<AuthenticationService> = {
      initWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
    };

    TestBed.configureTestingModule({
      providers: [
        SwapTemplateService,
        { provide: AuthenticationService, useValue: authService },
        { provide: ContractExecutorService, useValue: jest.fn() }]
    });
  });

  it('should be created', inject([SwapTemplateService], (service: SwapTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
