import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { AerumStatsWebsocketsService } from '@diagnostics/services/aerum-stats-websockets/aerum-stats-websockets.service';
import { environment } from './../../../../environments/environment';
const CHAT_URL = environment.webSocketStatServer;

@Injectable()
export class AerumStatsService {

	public aerumStats: Subject<any>;

	constructor(wsService: AerumStatsWebsocketsService) {
		this.aerumStats = <Subject<any>>wsService
			.connect(CHAT_URL)
			.map((response: MessageEvent): any => {
                return JSON.parse(response.data);
			});
    }
}