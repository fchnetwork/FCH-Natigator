import { TestBed, inject } from '@angular/core/testing';

import { ContractExecutorService } from './contract-executor.service';
import { SessionStorageService } from "ngx-webstorage";
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import Web3 from "web3";
import { LoggerService } from "@core/general/logger-service/logger.service";

describe('ContractExecutorService', () => {
  const authService: Partial<AuthenticationService> = {
    getWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3),
    getKeystore: () => ({ address: "test_keystroke" })
  };
  const sessionService: Partial<SessionStorageService> = {
    retrieve: () => ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContractExecutorService,
        { provide: AuthenticationService, useValue: authService },
        { provide: SessionStorageService, useValue: sessionService },
        { provide: LoggerService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([ContractExecutorService], (service: ContractExecutorService) => {
    expect(service).toBeTruthy();
  }));
});
