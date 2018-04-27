/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AerumStatsWebsocketsService } from './aerum-stats-websockets.service';

describe('Service: AerumStatsWebsockets', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AerumStatsWebsocketsService]
    });
  });

  it('should ...', inject([AerumStatsWebsocketsService], (service: AerumStatsWebsocketsService) => {
    expect(service).toBeTruthy();
  }));
});
