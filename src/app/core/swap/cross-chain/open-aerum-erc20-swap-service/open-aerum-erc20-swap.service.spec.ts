import { TestBed, inject } from '@angular/core/testing';

import { OpenAerumErc20SwapService } from './open-aerum-erc20-swap.service';

describe('OpenAerumErc20SwapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenAerumErc20SwapService]
    });
  });

  it('should be created', inject([OpenAerumErc20SwapService], (service: OpenAerumErc20SwapService) => {
    expect(service).toBeTruthy();
  }));
});
