import { Injectable } from '@angular/core';
import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { iSettings } from '@shared/app.interfaces';
import { StorageService } from "@core/general/storage-service/storage.service";
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class SettingsService {
    private expiration;

    get settings(): iSettings {
        return this.getSettings();
    };

    constructor(private storageService: StorageService,
                private notificationMessagesService: NotificationMessagesService,
                public translate: TranslateService,
                private environment: EnvironmentService) {
        this.getSettings();
        this.expiration = this.environment.get().settings.settingsExpiration;
    }

    /**
     *Get settings from a cookie. If there are no settings in cookies, then stores them there
     *
     * @returns {iSettings} Settings object
     * @memberof SettingsService
     */
    getSettings(): iSettings {
        const cookieSettings = this.storageService.getStorage("settings", false);
        if ( cookieSettings ) {
            return JSON.parse(cookieSettings);
        } else {
            return this.setDefaultSettings();
        }
    }

    /**
     * Set default settings from environment file
     *
     * @returns {iSettings} Settings object
     * @memberof SettingsService
     */
    setDefaultSettings(): iSettings {
        this.translate.setDefaultLang(this.environment.get().settings.language);
        const defaultLanguage = this.translate.getBrowserLang() ? this.translate.getBrowserLang() : this.environment.get().settings.language;
        this.translate.use(defaultLanguage);

        const settings = {
            generalSettings: {
                language: this.environment.get().settings.language,
                derivationPath: this.environment.get().settings.derivationPath,
                numberOfBlocks: this.environment.get().settings.numberOfBlocks
            },
            //set default transaction settings
            transactionSettings: {
                gasPrice: this.environment.get().settings.gasPrice,
                maxTransactionGas: this.environment.get().settings.maxTransactionGas,
                lastTransactionsNumber: this.environment.get().settings.lastTransactionsNumber
            },
            //set default system settings
            systemSettings: {
                aerumNodeWsURI: this.environment.get().WebsocketProvider,
                aerumNodeRpcURI: this.environment.get().rpcApiProvider,
                ethereumNodeURI: this.environment.get().ethereum.endpoint
            },
            accountSettings: {
                accName: ''
            }
        };
        const stringSettings = JSON.stringify(settings);
        this.storageService.setStorage("settings", stringSettings, false, this.expiration);
        return settings;
    }

    /**
     * Save settings set to cookie
     *
     * @param {string} key Name of the settings category
     * @param {*} settingsObj Object contains group of setings
     * @memberof SettingsService
     */
    saveSettings(settingsCategory: string, settingsObj: any) {
        let settings = this.getSettings();
        settings[settingsCategory] = settingsObj;
        this.settingsToCookie(settings);
    }

    /**
     * Save one setting to cookie
     *
     * @param {string} settingCategory Category of the setting
     * @param {string} settingKey Name of the setting to save
     * @param {string} settingValue Value of the setting
     * @memberof SettingsService
     */
    saveSetting(settingCategory: string, settingKey: string, settingValue: string) {
        let settings = this.getSettings();
        settings[settingCategory][settingKey] = settingValue;
        this.settingsToCookie(settings);
    }

    /**
     * Stringify settings and save them to cookie
     *
     * @memberof SettingsService
     */
    settingsToCookie(settings) {
        const stringSettings = JSON.stringify(settings);
        this.storageService.setStorage("settings", stringSettings, false, this.expiration);
        this.notificationMessagesService.saveSettings();
    }
}
