import { TestBed, inject } from '@angular/core/testing';

import { AerumNameService } from './aerum-name.service';

describe('AerumNameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AerumNameService]
    });
  });

  it('should be created', inject([AerumNameService], (service: AerumNameService) => {
    expect(service).toBeTruthy();
  }));
});
