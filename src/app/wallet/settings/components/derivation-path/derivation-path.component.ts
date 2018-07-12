import { Component } from '@angular/core';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { SettingsService } from '@app/core/settings/settings.service';

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
    let activeDerivation = this.settingsService.settings.generalSettings.derivationPath;
                                 
    this.derivationPaths.forEach( (path, i) => {
      if (path.derivation == activeDerivation ) {
        this.selectResult = this.derivationPaths[i];
      }
    });  
  }
 
  /**
   * Save derivation path to cookie when selected from dropdown
   *
   * @param {*} evt
   * @memberof DerivationPathComponent
   */
  derivationChanged(evt: iDerivationPaths){
    this.settingsService.saveSetting("generalSettings", "derivationPath", evt.derivation)
    this.notificationService.derivationModified(evt.derivation);
  }

}
