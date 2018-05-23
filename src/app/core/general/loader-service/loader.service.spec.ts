import { TestBed, async, inject } from '@angular/core/testing';
import { LoaderService } from './loader.service';
import { LoggerService } from "@app/core/general/logger-service/logger.service";
import { Router } from "@angular/router";
import { NgZone } from "@angular/core";

describe('Service: Loader', () => {
  beforeEach(() => {
    const router: Partial<Router> = {
      events: { subscribe: () => {} }
    };
    TestBed.configureTestingModule({
      providers: [
        LoaderService,
        { provide: LoggerService, useValue: jest.fn() },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('should ...', inject([LoaderService], (service: LoaderService) => {
    expect(service).toBeTruthy();
  }));
});
