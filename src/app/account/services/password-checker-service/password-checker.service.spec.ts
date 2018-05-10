/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PasswordCheckerService } from './password-checker.service';

describe('Service: PasswordChecker', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordCheckerService]
    });
  });

  it('should ...', inject([PasswordCheckerService], (service: PasswordCheckerService) => {
    expect(service).toBeTruthy();
  }));
});
