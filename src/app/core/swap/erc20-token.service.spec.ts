import { TestBed, inject } from '@angular/core/testing';

import { ERC20TokenService } from './erc20-token.service';

describe('ERC20TokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ERC20TokenService]
    });
  });

  it('should be created', inject([ERC20TokenService], (service: ERC20TokenService) => {
    expect(service).toBeTruthy();
  }));
});
