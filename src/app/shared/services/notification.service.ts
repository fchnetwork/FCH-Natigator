import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

    constructor() { }

    public showMessage(text: string) {
        alert(text);
    }
}
