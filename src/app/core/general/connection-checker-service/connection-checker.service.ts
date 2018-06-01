import { Injectable } from '@angular/core';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { environment } from '@env/environment';

@Injectable()
export class ConnectionCheckerService {
    
    connected: boolean = false;

    constructor(
        private notificationMessagesService: NotificationMessagesService
    ) { 
        this.initialCheck();
        setInterval(() => this.websocketCheck(), 10000);
    }

    private initialCheck() {
        let websocket = new WebSocket(environment.WebsocketProvider);
        websocket.addEventListener('error', res => {
            this.notificationMessagesService.connectionDisconnected();
        });
    }

    private websocketCheck() {
        let websocket = new WebSocket(environment.WebsocketProvider);

        websocket.addEventListener('open', res => {
           if (!this.connected) {
                this.connected = true;
                this.notificationMessagesService.connectionConnected();
           }
        });

        websocket.addEventListener('close', res => {
            if (this.connected) {
                this.connected = false;
                this.notificationMessagesService.connectionDisconnected();
            }
        });
    }

}
