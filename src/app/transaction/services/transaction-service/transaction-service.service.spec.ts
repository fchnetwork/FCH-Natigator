/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TransactionServiceService } from './transaction-service.service';

describe('Service: TransactionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionServiceService]
    });
  });

  it('should ...', inject([TransactionServiceService], (service: TransactionServiceService) => {
    expect(service).toBeTruthy();
  }));
});