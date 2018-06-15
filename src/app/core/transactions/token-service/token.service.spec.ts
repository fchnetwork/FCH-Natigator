import { TestBed, inject } from '@angular/core/testing';
import { TokenService } from './token.service';
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { SessionStorageService } from "ngx-webstorage";
import Web3 from "web3";

describe('Service: Token', () => {
  beforeEach(() => {
    const authService: Partial<AuthenticationService> = {
      getWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
    };

    TestBed.configureTestingModule({
      providers: [
        TokenService,
        { provide: AuthenticationService, useValue: authService },
        { provide: SessionStorageService, useValue: jest.fn() },
      ]
    });
  });

  it('should ...', inject([TokenService], (service: TokenService) => {
    expect(service).toBeTruthy();
  }));
});
