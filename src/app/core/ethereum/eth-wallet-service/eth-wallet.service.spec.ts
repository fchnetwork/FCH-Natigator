import { TestBed, inject } from '@angular/core/testing';

import { EthWalletService } from './eth-wallet.service';

describe('EthWalletService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EthWalletService]
    });
  });

  it('should be created', inject([EthWalletService], (service: EthWalletService) => {
    expect(service).toBeTruthy();
  }));
});
