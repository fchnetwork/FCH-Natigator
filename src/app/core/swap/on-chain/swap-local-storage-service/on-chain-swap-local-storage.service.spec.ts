import { TestBed, inject } from '@angular/core/testing';

import { OnChainSwapLocalStorageService } from './on-chain-swap-local-storage.service';
import { SessionStorageService } from "ngx-webstorage";

describe('OnChainSwapLocalStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OnChainSwapLocalStorageService,
        { provider: SessionStorageService, useValue: jest.fn() }
      ]
    });
  });

  it('should be created', inject([OnChainSwapLocalStorageService], (service: OnChainSwapLocalStorageService) => {
    expect(service).toBeTruthy();
  }));
});
