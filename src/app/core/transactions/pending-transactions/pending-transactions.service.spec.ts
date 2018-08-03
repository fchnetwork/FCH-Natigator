/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PendingTransactionsService } from './pending-transactions.service';

describe('Service: PendingTransactions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PendingTransactionsService]
    });
  });

  it('should ...', inject([PendingTransactionsService], (service: PendingTransactionsService) => {
    expect(service).toBeTruthy();
  }));
});
