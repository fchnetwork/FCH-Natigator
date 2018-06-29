import { Component } from '@angular/core';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { SettingsService } from '@app/core/settings/settings.service';
import { iGeneralSettings, iSettings } from '@shared/app.interfaces';

export interface iDerivationPaths {
  id: number;
  derivation:string;
  disabled: boolean;
}

@Component({
  selector: 'app-derivation-path',
  templateUrl: './derivation-path.component.html',
  styleUrls: ['./derivation-path.component.scss']
})
export class DerivationPathComponent {

  selectResult: any;
  activeDerivation: string;

  generalSettings: iGeneralSettings = {
    language: "",
    derivationPath: ""
  }
  
  derivationPaths: Array<iDerivationPaths> = [{
    id: 1,
    derivation: "m/44'/60'/0'/0/0",
    disabled: false,
  },{
    id: 2,
    derivation: "m/44'/312'/0'/0/0",
    disabled: true,
  }]  
  
  constructor(
      private notificationService: NotificationMessagesService,
      private settingsService: SettingsService ) 
  {
    this.getGeneralSettings();
    let activeDerivation = this.generalSettings.derivationPath;
                                 
    this.derivationPaths.forEach( (path, i) => {
      if (path.derivation == activeDerivation ) {
        this.selectResult = this.derivationPaths[i];
      }
    });  
  }
 
  derivationChanged(evt: iDerivationPaths){
    const generalSettings: iGeneralSettings = {
      language: this.generalSettings.language,
      derivationPath: evt.derivation,
    };
    this.settingsService.saveSettings("generalSettings", generalSettings);
    this.notificationService.derivationModified(evt.derivation);
  }

  getGeneralSettings() {
    let settings: iSettings = this.settingsService.getSettings();
    this.generalSettings.language = settings.generalSettings.language;
    this.generalSettings.derivationPath = settings.generalSettings.derivationPath;
  }  

}
