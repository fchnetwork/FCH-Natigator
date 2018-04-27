import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

    constructor() { }

    // TODO: We should remove this one & use one from aerum/ui
    showMessage(text: string) {
        alert(text);
    }
}
