import { Injectable } from '@angular/core';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';

@Injectable()
export class ValidateService {

constructor(
  private notificationService: InternalNotificationService
) { }
  pushErrNotifications(form){
    for(const field in form.controls) {
      if(form.controls[field].status !== 'VALID'){
        this.notificationService.showMessage(`${field} field is incorrect.`, 'FormError');
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
