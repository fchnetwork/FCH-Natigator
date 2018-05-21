import { TestBed, inject } from '@angular/core/testing';
import { TransactionService } from "@app/core/transactions/transaction-service/transaction.service";
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { SessionStorageService } from "ngx-webstorage";
import { ModalService } from "@app/core/general/modal-service/modal.service";
import Web3 from "web3";

describe('Service: TransactionService', () => {
  const authService: Partial<AuthenticationService> = {
    initWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionService,
        { provide: AuthenticationService, useValue: authService },
        { provide: SessionStorageService, useValue: jest.fn() },
        { provide: ModalService, useValue: jest.fn() }
      ]
    });
  });

  it('should ...', inject([TransactionService], (service: TransactionService) => {
    expect(service).toBeTruthy();
  }));
});
