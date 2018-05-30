/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NotificationMessagesService } from './notification-messages.service';

describe('Service: NotificationMessages', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationMessagesService]
    });
  });

  it('should ...', inject([NotificationMessagesService], (service: NotificationMessagesService) => {
    expect(service).toBeTruthy();
  }));
});
