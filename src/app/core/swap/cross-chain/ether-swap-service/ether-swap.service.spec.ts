import { TestBed, inject } from '@angular/core/testing';

import { SessionStorageService } from "ngx-webstorage";
import { EtherSwapService } from './ether-swap.service';

describe('EtherSwapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EtherSwapService,
        { provide: SessionStorageService, useValue: jest.fn() },
      ]
    });
  });

  it('should be created', inject([EtherSwapService], (service: EtherSwapService) => {
    expect(service).toBeTruthy();
  }));
});
