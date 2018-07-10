import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { languages as lang, iLanguage, languages } from '../../helpers/data.mock';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';

import { SettingsService } from '@app/core/settings/settings.service';

 
@Component({
  selector: 'app-i18n',
  templateUrl: './i18n.component.html',
  styleUrls: ['./i18n.component.scss']
})
export class I18nComponent {
  languages: Array<iLanguage> = lang;
  activeLanguage: iLanguage;
    
  constructor( 
    public translate: TranslateService, 
    private notificationMessagesService: NotificationMessagesService,
    private settingsService: SettingsService
  ) 
  {
    let activeLanguage = this.settingsService.settings.generalSettings.language;                        
    this.languages.forEach( (language, i) => {
      if (language.lang.substring(0, 2).toLowerCase() == activeLanguage ) {
        this.activeLanguage = this.languages[i];
      }
    });
  }

  /**
   * Save language to cookie when language selected from dropdown
   *
   * @param {iLanguage} event
   * @memberof I18nComponent
   */
  langChanged(event: iLanguage) {
    this.translate.use( event.lang.substring(0, 2).toLowerCase() );
    this.settingsService.saveSetting("generalSettings", "language", event.lang.substring(0, 2).toLowerCase());
    this.notificationMessagesService.langugeChanged(event.lang);
  }

}
