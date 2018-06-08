import { TestBed, inject } from '@angular/core/testing';

import { SessionStorageService } from "ngx-webstorage";
import { SwapLocalStorageService } from './swap-local-storage.service';

describe('SwapLocalStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SwapLocalStorageService,
        { provide: SessionStorageService, useValue: jest.fn() },
      ]
    });
  });

  it('should be created', inject([SwapLocalStorageService], (service: SwapLocalStorageService) => {
    expect(service).toBeTruthy();
  }));
});
