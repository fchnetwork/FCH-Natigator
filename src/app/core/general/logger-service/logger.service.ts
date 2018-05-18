import { Injectable } from '@angular/core';
import { LogLevel } from '@app/core/general/logger-service/log-level.enum';

@Injectable()
export class LoggerService {
    private logLevel : LogLevel = LogLevel.All;

    constructor() { 
        console.log('[LOGGER] - Initialized');
    }

    public setLogLevel(logLevel: LogLevel) {
        this.logLevel = logLevel;
    }

    public logError(message:string, data?:any) {
        this.log(message, data, LogLevel.Error);
    }

    public logWarning(message:string, data?:any) {
        this.log(message, data, LogLevel.Warning);
    }

    public logMessage(message:string, data?:any) {
        this.log(message, data, LogLevel.Message);
    }

    private log(message: string, data:any, level: LogLevel) {
        let currentLevel = this.logLevel;

        if(currentLevel == LogLevel.All || level == currentLevel) {
            let fullMessage = '[' + level.toUpperCase() + '] - ' + message;
            
            if(!data) {
                data = '';
            }

            switch(level) {
                case LogLevel.Error: console.error(fullMessage, data); break;
                case LogLevel.Warning: console.warn(fullMessage, data); break;
                case LogLevel.Message: console.log(fullMessage, data); break;                
            }
 
        }
    }
}
