/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddressKeyValidationService } from './address-key-validation.service';

describe('Service: AddressKeyValidation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressKeyValidationService]
    });
  });

  it('should ...', inject([AddressKeyValidationService], (service: AddressKeyValidationService) => {
    expect(service).toBeTruthy();
  }));
});
