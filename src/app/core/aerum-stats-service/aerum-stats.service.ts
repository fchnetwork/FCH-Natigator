import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx'; 
import { environment } from '@env/environment'; 
import { AerumStatsWebsocketsService } from '@app/core/aerum-stats-websockets-service/aerum-stats-websockets.service';

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