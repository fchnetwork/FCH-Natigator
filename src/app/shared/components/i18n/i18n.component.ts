import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { languages } from '../../helpers/data.mock';

@Component({
  selector: 'app-i18n',
  templateUrl: './i18n.component.html',
  styleUrls: ['./i18n.component.scss']
})
export class I18nComponent {
  
  activeLanguage = "en";
  
  isOptionsActive = false;
  
  languages: any[] = languages;
    
  constructor( public translate: TranslateService ) { }

  openLangOptions() {
    this.isOptionsActive = !this.isOptionsActive;
  }
  
  changeLang(language: string) {
    const lang = language.toString().trim().toLowerCase();
    this.translate.use( lang );
    this.activeLanguage = lang;      
  }

}
