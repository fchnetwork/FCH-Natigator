import { TestBed, inject } from '@angular/core/testing';

import { NameResolverService } from './name-resolver.service';

describe('NameResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NameResolverService]
    });
  });

  it('should be created', inject([NameResolverService], (service: NameResolverService) => {
    expect(service).toBeTruthy();
  }));
});
