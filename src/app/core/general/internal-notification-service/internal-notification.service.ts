import { Injectable } from '@angular/core';
import { NotificationService } from '@aerum/ui';
@Injectable()
export class InternalNotificationService {
    counter: number = 1;
    constructor(
        private notificationService: NotificationService,
    ) { }

    // TODO: We should remove this one & use one from aerum/ui
    showMessage(text: string, type: string) {
        // alert(text);
        this.notificationService.notify(`${this.counter} ${type ? type : 'Done'}`, text, 'gear', 3000);
        this.counter++;
        setTimeout(()=>{
            this.counter--;
        }, 3000);
    }
}
