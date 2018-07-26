import { TestBed, inject } from '@angular/core/testing';

import { StorageService } from "@core/general/storage-service/storage.service";
import { SwapLocalStorageService } from './swap-local-storage.service';

describe('SwapLocalStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SwapLocalStorageService,
        { provide: StorageService, useValue: jest.fn() },
      ]
    });
  });

  it('should be created', inject([SwapLocalStorageService], (service: SwapLocalStorageService) => {
    expect(service).toBeTruthy();
  }));
});
