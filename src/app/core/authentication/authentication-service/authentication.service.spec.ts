import { TestBed, inject } from '@angular/core/testing';

import Web3 from 'web3';
import { AuthenticationService } from './authentication.service';
import { StorageService } from "@core/general/storage-service/storage.service";
import { Router } from "@angular/router";

/*
class TestableAuthenticationService extends AuthenticationService {
  constructor
} */

describe('Service: Authentication', () => {

  beforeEach(() => {
    jest.spyOn(AuthenticationService.prototype, "getWeb3").mockImplementation(() => ({} as any as Web3));
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: StorageService, useValue: jest.fn() },
        { provide: Router, useValue: jest.fn() }
      ]
    });
  });

  it('should ...', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
