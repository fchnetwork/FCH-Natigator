/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConnectionCheckerService } from './connection-checker.service';
import { NotificationMessagesService } from "@core/general/notification-messages-service/notification-messages.service";

describe('Service: ConnectionChecker', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConnectionCheckerService,
        { provide: NotificationMessagesService, useValue: jest.fn() }
      ]
    });
  });

  it('should ...', inject([ConnectionCheckerService], (service: ConnectionCheckerService) => {
    expect(service).toBeTruthy();
  }));
});
