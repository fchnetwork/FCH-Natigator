import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { languages as lang, iLanguage, languages } from '../../helpers/data.mock';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';

import { SettingsService } from '@app/core/settings/settings.service';
import { iGeneralSettings, iSettings } from '@shared/app.interfaces';

 
@Component({
  selector: 'app-i18n',
  templateUrl: './i18n.component.html',
  styleUrls: ['./i18n.component.scss']
})
export class I18nComponent {
  languages: Array<iLanguage> = lang;
  activeLanguage: iLanguage;

  generalSettings: iGeneralSettings = {
    language: "",
    derivationPath: ""
  }
    
  constructor( 
    public translate: TranslateService, 
    private notificationMessagesService: NotificationMessagesService,
    private settingsService: SettingsService
  ) 
  {
    this.getGeneralSettings();
    let activeLanguage = this.generalSettings.language;                           
    this.languages.forEach( (language, i) => {
      if (language.lang.substring(0, 2).toLowerCase() == activeLanguage ) {
        this.activeLanguage = this.languages[i];
      }
    });
  }

  langChanged(event: iLanguage) {
    this.translate.use( event.lang.substring(0, 2).toLowerCase() );
    const generalSettings: iGeneralSettings = {
      language: event.lang.substring(0, 2).toLowerCase(),
      derivationPath: this.generalSettings.derivationPath
    };
    this.settingsService.saveSettings("generalSettings", generalSettings);
    this.notificationMessagesService.langugeChanged(event.lang);
  }

  getGeneralSettings() {
    let settings: iSettings = this.settingsService.getSettings();
    this.generalSettings.language = settings.generalSettings.language;
    this.generalSettings.derivationPath = settings.generalSettings.derivationPath;
  } 

}
