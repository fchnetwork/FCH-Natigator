import { TestBed, inject } from '@angular/core/testing';

import { EthereumAuthenticationService } from './ethereum-authentication.service';
import { LoggerService } from "@core/general/logger-service/logger.service";
import { StorageService } from "@core/general/storage-service/storage.service";

describe('EthereumAuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EthereumAuthenticationService,
        { provide: LoggerService, useValue: jest.fn() },
        { provide: StorageService, useValue: jest.fn() },
      ]
    });
  });

  it('should be created', inject([EthereumAuthenticationService], (service: EthereumAuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
