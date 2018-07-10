import { Component, OnInit } from '@angular/core';
import { iGeneralSettings, iSettings } from '@shared/app.interfaces';
import { SettingsService } from '@app/core/settings/settings.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';

@Component({
  selector: 'app-settings-general',
  templateUrl: './settings-general.component.html',
  styleUrls: ['./settings-general.component.scss']
})
export class SettingsGeneralComponent implements OnInit {

  generalSettings: iGeneralSettings = {
    language: "",
    derivationPath: "",
    numberOfBlocks: 0
  }

  constructor(private notificationService: InternalNotificationService,
              private settingsService: SettingsService) 
  { 
    this.getGeneralSettings();
  }

  ngOnInit() {
  }

  saveSettings() {
    const generalSettings: iGeneralSettings = {
      language: this.generalSettings.language,
      derivationPath: this.generalSettings.derivationPath,
      numberOfBlocks: this.generalSettings.numberOfBlocks
    };
    this.settingsService.saveSettings("generalSettings", generalSettings);
  }

  getGeneralSettings() {
    let settings: iSettings = this.settingsService.getSettings();
    this.generalSettings.language = settings.generalSettings.language;
    this.generalSettings.derivationPath = settings.generalSettings.derivationPath;
    this.generalSettings.numberOfBlocks = settings.generalSettings.numberOfBlocks;
  } 

}
