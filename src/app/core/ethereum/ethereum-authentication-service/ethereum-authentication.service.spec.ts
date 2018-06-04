import { TestBed, inject } from '@angular/core/testing';

import { EthereumAuthenticationService } from './ethereum-authentication.service';

describe('EthereumAuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EthereumAuthenticationService]
    });
  });

  it('should be created', inject([EthereumAuthenticationService], (service: EthereumAuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
