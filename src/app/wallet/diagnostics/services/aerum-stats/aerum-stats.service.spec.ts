/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AerumStatsService } from './aerum-stats.service';

describe('Service: AerumStats', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AerumStatsService]
    });
  });

  it('should ...', inject([AerumStatsService], (service: AerumStatsService) => {
    expect(service).toBeTruthy();
  }));
});
