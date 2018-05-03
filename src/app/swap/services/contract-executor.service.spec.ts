import { TestBed, inject } from '@angular/core/testing';

import { ContractExecutorService } from './contract-executor.service';

describe('ContractExecutorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractExecutorService]
    });
  });

  it('should be created', inject([ContractExecutorService], (service: ContractExecutorService) => {
    expect(service).toBeTruthy();
  }));
});
