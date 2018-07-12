import { Injectable } from '@angular/core';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';


@Injectable()
export class ValidateService {

constructor(
  private notificationMessagesService: NotificationMessagesService
) { }
  pushErrNotifications(form){
    for(const field in form.controls) {
      if(form.controls[field].status !== 'VALID'){
        this.notificationMessagesService.wrongValueProvided(field);
      }
    }
  }

  validateForm(form, message) {
    if(form.status === 'VALID') {
      return true;
    } else {
      this.pushErrNotifications(form);
      return false;
    }
  }
}
