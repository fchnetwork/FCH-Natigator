/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UniversalLinkService } from './universal-link.service';

describe('Service: UniversalLink', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UniversalLinkService]
    });
  });

  it('should ...', inject([UniversalLinkService], (service: UniversalLinkService) => {
    expect(service).toBeTruthy();
  }));
});
