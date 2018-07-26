import { TestBed, inject } from '@angular/core/testing';

import Web3 from "web3";
import { ContractExecutorService } from './contract-executor.service';
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import { LoggerService } from "@core/general/logger-service/logger.service";

describe('ContractExecutorService', () => {
  const authService: Partial<AuthenticationService> = {
    getWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3),
    getKeystore: () => ({ address: "test_keystroke" })
  };
  const sessionService: Partial<StorageService> = {
    getSessionData: () => ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContractExecutorService,
        { provide: AuthenticationService, useValue: authService },
        { provide: StorageService, useValue: sessionService },
        { provide: LoggerService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([ContractExecutorService], (service: ContractExecutorService) => {
    expect(service).toBeTruthy();
  }));
});
