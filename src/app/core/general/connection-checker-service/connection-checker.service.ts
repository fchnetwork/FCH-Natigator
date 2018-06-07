import { Injectable } from '@angular/core';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { LoaderService } from '@core/general/loader-service/loader.service';
import { environment } from '@env/environment';

@Injectable()
export class ConnectionCheckerService {

    connected: boolean = false;

    private readonly STATE_OPEN: number = 1;
    private readonly STATE_CLOSED: number = 3;

    private websocket: WebSocket = new WebSocket(environment.WebsocketProvider);
    private pingInterval: number = 10000;
    private onDeath: () => any;
    private alive: boolean = true;

    constructor(
        private notificationMessagesService: NotificationMessagesService,
        private loaderService: LoaderService,
    ) {
        this.initWebsocket();
        // this.loaderService.toggle(true, "Connecting to aerum network...");
    }

    private initWebsocket() {
        this.websocket = new WebSocket(environment.WebsocketProvider);
        // this.loaderService.toggle(true, "Connecting to aerum network...");

        this.websocket.addEventListener('open', res => {
            if (this.connected) {
                this.connected = true;
                this.notificationMessagesService.connectionConnected();
            }
        });

        this.websocket.addEventListener('close', res => {
            if (this.connected) {
                this.connected = false;
                this.notificationMessagesService.connectionDisconnected(); 
                this.initWebsocket();
            }
        });

        this.websocket.addEventListener('error', res => {
            if (this.connected) {
                this.connected = false;
                this.notificationMessagesService.connectionDisconnected();
                this.initWebsocket();
            }
        });
    }

   

    // private websocketCheck() {
    //     let websocket = new WebSocket(environment.WebsocketProvider);

    //     websocket.addEventListener('open', res => {
    //        if (!this.connected) {
    //             this.connected = true;
    //             this.notificationMessagesService.connectionConnected();
    //        }
    //     });

    //     websocket.addEventListener('close', res => {
    //         if (this.connected) {
    //             this.connected = false;
    //             this.notificationMessagesService.connectionDisconnected();
    //         }
    //     });
    // }

}