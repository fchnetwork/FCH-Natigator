/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoadTransactionService } from './load-transaction.service';

describe('Service: LoadTransaction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadTransactionService]
    });
  });

  it('should ...', inject([LoadTransactionService], (service: LoadTransactionService) => {
    expect(service).toBeTruthy();
  }));
});
