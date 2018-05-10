/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccountIdleService } from './account-idle.service';

describe('Service: AccountIdle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountIdleService]
    });
  });

  it('should ...', inject([AccountIdleService], (service: AccountIdleService) => {
    expect(service).toBeTruthy();
  }));
});
