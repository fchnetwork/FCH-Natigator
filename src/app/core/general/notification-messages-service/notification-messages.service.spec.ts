import { TestBed, inject } from '@angular/core/testing';
import { NotificationMessagesService } from './notification-messages.service';
import { NotificationService } from "@aerum/ui";
import { TranslateService } from "@ngx-translate/core";

describe('Service: NotificationMessages', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationMessagesService,
        { provide: NotificationService, useValue: jest.fn() },
        { provide: TranslateService, useValue: jest.fn() }
      ]
    });
  });

  it('should ...', inject([NotificationMessagesService], (service: NotificationMessagesService) => {
    expect(service).toBeTruthy();
  }));
});
