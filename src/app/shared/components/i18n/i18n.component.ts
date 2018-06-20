import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { languages as lang, iLanguage, languages } from '../../helpers/data.mock';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';

 
@Component({
  selector: 'app-i18n',
  templateUrl: './i18n.component.html',
  styleUrls: ['./i18n.component.scss']
})
export class I18nComponent {
  languages: Array<iLanguage> = lang;
  activeLanguage = languages[5];
    
  constructor( 
    public translate: TranslateService, 
    private notificationMessagesService: NotificationMessagesService) { 
  }

  langChanged(event: iLanguage) {
    this.translate.use( event.lang.substring(0, 2).toLowerCase() );
    this.activeLanguage = event;
    this.notificationMessagesService.langageChanged(event.lang);
  }

}
