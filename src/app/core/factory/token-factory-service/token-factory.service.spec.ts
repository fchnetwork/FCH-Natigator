import { TestBed, inject } from '@angular/core/testing';

import { TokenFactoryService } from './token-factory.service';

describe('TokenFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenFactoryService]
    });
  });

  it('should be created', inject([TokenFactoryService], (service: TokenFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
