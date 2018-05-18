import { TestBed, inject } from '@angular/core/testing';

import { AensFixedPriceRegistrarContractService } from './aens-fixed-price-registrar-contract.service';

describe('AensFixedPriceRegistrarContractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AensFixedPriceRegistrarContractService]
    });
  });

  it('should be created', inject([AensFixedPriceRegistrarContractService], (service: AensFixedPriceRegistrarContractService) => {
    expect(service).toBeTruthy();
  }));
});
