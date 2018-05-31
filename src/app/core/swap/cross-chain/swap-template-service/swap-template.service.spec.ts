import { TestBed, inject } from '@angular/core/testing';

import { SwapTemplateService } from './swap-template.service';

describe('SwapTemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwapTemplateService]
    });
  });

  it('should be created', inject([SwapTemplateService], (service: SwapTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
