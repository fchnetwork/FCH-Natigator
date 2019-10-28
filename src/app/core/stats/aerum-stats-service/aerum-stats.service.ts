import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { AerumStatsWebsocketsService } from '@app/core/stats/aerum-stats-websockets-service/aerum-stats-websockets.service';

@Injectable()
export class AerumStatsService {
	public aerumStats: Subject<any>;

	constructor(wsService: AerumStatsWebsocketsService, private environment: EnvironmentService) {
		this.aerumStats = <Subject<any>>wsService
			.connect(this.environment.get().webSocketStatServer)
			.map((response: MessageEvent): any => {
                return JSON.parse(response.data);
			});
    }
}
