/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AerumbitService } from './aerumbit.service';

describe('Service: Aerumbit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AerumbitService]
    });
  });

  it('should ...', inject([AerumbitService], (service: AerumbitService) => {
    expect(service).toBeTruthy();
  }));
});
