/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImportWalletService } from './import-wallet.service';

describe('Service: ImportWallet', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImportWalletService]
    });
  });

  it('should ...', inject([ImportWalletService], (service: ImportWalletService) => {
    expect(service).toBeTruthy();
  }));
});
