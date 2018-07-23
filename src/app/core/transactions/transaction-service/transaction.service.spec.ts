import { TestBed, inject } from '@angular/core/testing';

import Web3 from "web3";
import { TransactionService } from "@app/core/transactions/transaction-service/transaction.service";
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import { ModalService } from "@app/core/general/modal-service/modal.service";
import { TokenService } from "@core/transactions/token-service/token.service";
import { NotificationMessagesService } from "@core/general/notification-messages-service/notification-messages.service";

describe('Service: TransactionService', () => {
  const authService: Partial<AuthenticationService> = {
    getWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionService,
        { provide: AuthenticationService, useValue: authService },
        { provide: StorageService, useValue: jest.fn() },
        { provide: ModalService, useValue: jest.fn() },
        { provide: TokenService, useValue: jest.fn() },
        { provide: NotificationMessagesService, useValue: jest.fn() }
      ]
    });
  });

  it('should ...', inject([TransactionService], (service: TransactionService) => {
    expect(service).toBeTruthy();
  }));
});
