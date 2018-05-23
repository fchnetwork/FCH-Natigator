import { TestBed, inject } from '@angular/core/testing';

import Web3 from 'web3';
import { AuthenticationService } from './authentication.service';
import { SessionStorageService } from "ngx-webstorage";
import { Router } from "@angular/router";
import { ConvertToEtherPipe } from "@shared/pipes/convertToEther.pipe";

/*
class TestableAuthenticationService extends AuthenticationService {
  constructor
} */

describe('Service: Authentication', () => {

  beforeEach(() => {
    jest.spyOn(AuthenticationService.prototype, "initWeb3").mockImplementation(() => ({} as any as Web3));
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: SessionStorageService, useValue: jest.fn() },
        { provide: Router, useValue: jest.fn() }
      ]
    });
  });

  it('should ...', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
