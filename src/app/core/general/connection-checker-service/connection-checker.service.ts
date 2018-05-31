import { Injectable } from '@angular/core';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { environment } from '@env/environment';

@Injectable()
export class ConnectionCheckerService {
    
    web3: any;
    connected: boolean = false;
    private baseUrl = environment.httpProvider;
    private isOnline = false;

    constructor(
        private notificationMessagesService: NotificationMessagesService
    ) { 
        setInterval(() => this.connectionCheck(), 1000);
    }

    onlineCheck() {
        let xhr = new XMLHttpRequest();
        return new Promise((resolve, reject)=>{
            xhr.onload = () => {
                // Set online status
                this.isOnline = true;
                resolve(true);
            };
            xhr.onerror = () => {
                // Set online status
                this.isOnline = false;
                reject(false);
            };
            xhr.open('GET', this.baseUrl, true);
            xhr.send();
        });
    }

    connectionCheck () {
        this.onlineCheck().then(() => {
            if (!this.connected) {
                this.connected = true;
                this.notificationMessagesService.connectionRestored();
            }
        }).catch(() => {
            if (this.connected) {
                this.connected = false;
                this.notificationMessagesService.connectionLost();
            }
        });
    }

}
