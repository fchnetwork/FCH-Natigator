import { TestBed, inject } from '@angular/core/testing';

import { EthereumTokenService } from './ethereum-token.service';

describe('EthTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EthereumTokenService]
    });
  });

  it('should be created', inject([EthereumTokenService], (service: EthereumTokenService) => {
    expect(service).toBeTruthy();
  }));
});
