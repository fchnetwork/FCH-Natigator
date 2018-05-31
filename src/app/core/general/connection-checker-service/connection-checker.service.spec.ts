/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConnectionCheckerService } from './connection-checker.service';

describe('Service: ConnectionChecker', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectionCheckerService]
    });
  });

  it('should ...', inject([ConnectionCheckerService], (service: ConnectionCheckerService) => {
    expect(service).toBeTruthy();
  }));
});
