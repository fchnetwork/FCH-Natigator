import { Injectable } from '@angular/core';
import { environment } from '@app/../environments/environment';
import * as CryptoJS from 'crypto-js';
import { iSettings } from '@shared/app.interfaces';
import { StorageService } from "@core/general/storage-service/storage.service";
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';

@Injectable()
export class SettingsService {

    public settings: iSettings = {
        generalSettings: {
            language: "",
            derivationPath: ""
        },
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

    private expiration = environment.settings.settingsExpiration;

    constructor(private storageService: StorageService,
                private notificationMessagesService: NotificationMessagesService) {
        this.getSettings();
    }

    /**
     *Get settings from a cookie if there are no settings in cookies, then stores them there 
     *
     * @returns {iSettings} Settings object
     * @memberof SettingsService
     */
    getSettings(): iSettings { 
        const cookieSettings = this.storageService.getCookie("settings", false); 
        if ( cookieSettings ) {
            this.settings = JSON.parse(cookieSettings);
        } else {
            this.settings = this.setDefaultSettings(); 
        }
        return this.settings;
    }

    /**
     * Set default settings from environment file
     *
     * @returns {iSettings} Settings object
     * @memberof SettingsService
     */
    setDefaultSettings(): iSettings {
        const settings = {
            generalSettings: {
                language: environment.settings.laguage,
                derivationPath: environment.settings.derivationPath
            },
            //set default transaction settings
            transactionSettings: {
                gasPrice: environment.settings.gasPrice,
                maxTransactionGas: environment.settings.maxTransactionGas,
                lastTransactionsNumber: environment.settings.lastTransactionsNumber
            },
            //set default system settings
            systemSettings: {
                aerumNodeWsURI: environment.WebsocketProvider,
                aerumNodeRpcURI: environment.rpcApiProvider,
                ethereumNodeURI: environment.ethereum.endpoint
            }
        };
        const stringSettings = JSON.stringify(settings);
        this.storageService.setCookie("settings", stringSettings, false, this.expiration);
        return settings;
    }
    
    /**
     * Save settings to cookie
     *
     * @param {string} key Name of the settings group
     * @param {*} settingsObj Object contains group of setings
     * @memberof SettingsService
     */
    saveSettings(key: string, settingsObj: any) {
        this.settings = this.getSettings();
        this.settings[key] = settingsObj;
        const stringSettings = JSON.stringify(this.settings);
        this.storageService.setCookie("settings", stringSettings, false, this.expiration);
        this.notificationMessagesService.saveSettings();
    }
}
