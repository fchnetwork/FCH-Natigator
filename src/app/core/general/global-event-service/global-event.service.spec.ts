/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GlobalEventService } from './global-event.service';

describe('Service: Event', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalEventService]
    });
  });

  it('should ...', inject([GlobalEventService], (service: GlobalEventService) => {
    expect(service).toBeTruthy();
  }));
});
