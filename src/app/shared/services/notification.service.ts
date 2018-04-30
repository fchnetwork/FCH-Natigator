import { Injectable } from '@angular/core';
import { NotificationService } from '@aerum/ui';
@Injectable()
export class InternalNotificationService {
    counter: number = 1;
    constructor(
        private notificationService: NotificationService,
    ) { }

    showMessage(text: string) {
        // alert(text);
        this.notificationService.notify(this.counter + ' Done', text, 'gear', 3000);
        this.counter++;
        setTimeout(()=>{
            this.counter--;
        }, 3000);
    }
}
