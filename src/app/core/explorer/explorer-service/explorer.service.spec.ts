import { TestBed, async, inject } from '@angular/core/testing';
import { ExplorerService } from './explorer.service';
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { Http } from '@angular/http';
import Web3 from "web3";

describe('Service: Explorer', () => {
  const authService: Partial<AuthenticationService> = {
    getWeb3: () => ({ eth: { Contract: () => { } } } as any as Web3)
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExplorerService,
        { provide: AuthenticationService, useValue: authService },
        { provide: Http, useValue: jest.fn() }
      ]
    });
  });

  it('should ...', inject([ExplorerService], (service: ExplorerService) => {
    expect(service).toBeTruthy();
  }));
});
