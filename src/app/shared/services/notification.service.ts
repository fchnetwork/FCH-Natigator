import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

    constructor() { }

    showMessage(text: string) {
        alert(text);
    }
}
