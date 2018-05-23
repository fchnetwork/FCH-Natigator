import { TestBed, inject } from '@angular/core/testing';
import { AerumStatsService } from './aerum-stats.service';
import { AerumStatsWebsocketsService } from "@app/core/stats/aerum-stats-websockets-service/aerum-stats-websockets.service";
import { Subject } from "rxjs/Subject";

describe('Service: AerumStats', () => {
  const statsWebsocketService: Partial<AerumStatsWebsocketsService> = {
    connect: () => new Subject<MessageEvent>()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AerumStatsService,
        { provide: AerumStatsWebsocketsService, useValue: statsWebsocketService }
      ]
    });
  });

  it('should ...', inject([AerumStatsService], (service: AerumStatsService) => {
    expect(service).toBeTruthy();
  }));
});
