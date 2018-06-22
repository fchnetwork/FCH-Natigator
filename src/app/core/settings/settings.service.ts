import { Injectable } from '@angular/core';
import { environment } from '@app/../environments/environment';
import * as CryptoJS from 'crypto-js';
import { iSettings } from '@shared/app.interfaces';
import { StorageService } from "@core/general/storage-service/storage.service";
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';

@Injectable()
export class SettingsService {

    public settings: iSettings = {
        transactionSettings: {
            gasPrice: "",
            maxTransactionGas: "",
            lastTransactionsNumber: ""
        },
        systemSettings: {
            aerumNodeWsURI: "",
            aerumNodeRpcURI: "",
            ethereumNodeURI: ""
        }
    };

    constructor(private storageService: StorageService,
                private notificationMessagesService: NotificationMessagesService) {
        this.getSettings();
    }

    /**
     *Get settings from a cookie of if there are no settings in cookies, then stores them there 
     *
     * @returns {iSettings} Settings
     * @memberof SettingsService
     */
    getSettings(): iSettings { 
        const cookieSettings = this.storageService.getCookie("settings", true); 
        if ( cookieSettings ) { 
            return JSON.parse(cookieSettings);
        } else {
            const settings = this.setDefaultSettings();
            return settings;
        }
    }

    setDefaultSettings(): iSettings {
        const settings = {
            //set default transaction settings
            transactionSettings: {
                gasPrice: environment.gasPrice,
                maxTransactionGas: environment.maxTransactionGas,
                lastTransactionsNumber: environment.lastTransactionsNumber
            },
            //set default system settings
            systemSettings: {
                aerumNodeWsURI: environment.rpcApiProvider,
                aerumNodeRpcURI: environment.WebsocketProvider,
                ethereumNodeURI: environment.ethereum.endpoint
            }
        };
        const stringSettings = JSON.stringify(settings);
        this.storageService.setCookie("settings", stringSettings, true, 3650);
        return settings;
    }

    saveSettings(key: string, settingsObj: any) {
        this.settings = this.getSettings();
        this.settings[key] = settingsObj;
        const stringSettings = JSON.stringify(this.settings);
        this.storageService.setCookie("settings", stringSettings, true, 3650);
        this.notificationMessagesService.saveSettings();
    }
}
