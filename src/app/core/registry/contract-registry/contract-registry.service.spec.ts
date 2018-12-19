/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContractRegistryService } from './contract-registry.service';

describe('Service: ContractRegistry', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractRegistryService]
    });
  });

  it('should ...', inject([ContractRegistryService], (service: ContractRegistryService) => {
    expect(service).toBeTruthy();
  }));
});
