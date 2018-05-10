/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing'; 
import { InternalNotificationService } from '@app/core/internal-notification-service/internal-notification.service';

describe('Service: Notification', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InternalNotificationService]
    });
  });

  it('should ...', inject([InternalNotificationService], (service: InternalNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
