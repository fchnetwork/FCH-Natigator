import { Injectable } from '@angular/core';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { LoaderService } from '@core/general/loader-service/loader.service';
import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { LoggerService } from '@app/core/general/logger-service/logger.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ConnectionCheckerService {

    private connected: boolean = false;
    private heartbeat_interval: any = null;
    private missed_heartbeats: number = 0;
    private socket_id: number = 0;
    private heartbeat_msg: string = '{"jsonrpc":"2.0","method":"net_listening","params":[],"id":67}';

    private websocket: WebSocket;

    constructor(
        private notificationMessagesService: NotificationMessagesService,
        private loaderService: LoaderService,
        private logger: LoggerService,
        private translateService: TranslateService,
        private environment: EnvironmentService
    ) {
        this.initWebsocket();
    }

    protected translate(key: string): string {
        return this.translateService.instant(key);
    }

    private initWebsocket() {
        this.websocket = new WebSocket(this.environment.get().WebsocketProvider);
        this.socket_id = Math.random() * 100;
        this.websocket.addEventListener('open', ev => this.onOpen(ev));
        this.websocket.addEventListener('error', ev => this.onError(ev));
    }

    private onOpen(ev: Event) {
        // add closed handler after ws is initialized
        this.websocket.addEventListener('close', ev => this.onClosed(ev));

        this.loaderService.toggle(false);
        this.notificationMessagesService.connectionConnected();
        this.connected = true;

        if (this.heartbeat_interval === null) {
            this.missed_heartbeats = 0;
            this.heartbeat_interval = setInterval(this.checkHeartbeat, 3000, this.missed_heartbeats, this.websocket, this.heartbeat_interval, this.heartbeat_msg, this.logger);
        }
    }

    private onClosed(ev: CloseEvent) {
        this.loaderService.toggle(true, this.translateService.instant("CONNECTION.CONNECTING_TO_AERUM"));

        clearInterval(this.heartbeat_interval);

        if (this.connected) {
            this.notificationMessagesService.connectionDisconnected();
            this.connected = false;
        }

        this.initWebsocket();
    }

    private onError(ev: Event) {
        clearInterval(this.heartbeat_interval);

        if(this.websocket != null && this.websocket.readyState == this.websocket.CLOSED) {
            this.loaderService.toggle(true, this.translateService.instant("CONNECTION.CONNECTING_TO_AERUM"));
        }

        if(!this.connected) {
            this.initWebsocket();
        }
    }

    private checkHeartbeat(missed_heartbeats, websocket, heartbeat_interval, heartbeat_msg, logger) {
        try {
            missed_heartbeats += 1;

            if (missed_heartbeats >= 3) {
                throw new Error("Too many missed heartbeats.");
            }

            websocket.send(heartbeat_msg);
        } catch (e) {
            clearInterval(heartbeat_interval);
            heartbeat_interval = null;
            logger.logWarning("Closing connection. Reason: " + e.message);
            websocket.close();
        }
    }
}
