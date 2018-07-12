import { Component, OnInit } from '@angular/core';
import { iGeneralSettings, iSettings } from '@shared/app.interfaces';
import { SettingsService } from '@app/core/settings/settings.service';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { ValidateService } from '@app/core/validation/validate.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  settingsForm: FormGroup = this.formBuilder.group({});

  constructor(private notificationMessagesService: NotificationMessagesService,
              private settingsService: SettingsService,
              private validateService: ValidateService,
              private formBuilder: FormBuilder) 
  { 
    this.getGeneralSettings();
  }

  ngOnInit() {
    const regexBlocks = "^(?:[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$";
    this.settingsForm = this.formBuilder.group({
      "Number of Blocks": [null, [Validators.required, Validators.pattern(regexBlocks)]]
    });
  }

  saveSettings() {
    const valid = this.validateService.validateForm(this.settingsForm, 'All fields are valid');
    if (valid) {
      const generalSettings: iGeneralSettings = {
        language: this.generalSettings.language,
        derivationPath: this.generalSettings.derivationPath,
        numberOfBlocks: this.generalSettings.numberOfBlocks
      };
      this.settingsService.saveSettings("generalSettings", generalSettings);
    }
  }

  getGeneralSettings() {
    let settings: iSettings = this.settingsService.getSettings();
    this.generalSettings.language = settings.generalSettings.language;
    this.generalSettings.derivationPath = settings.generalSettings.derivationPath;
    this.generalSettings.numberOfBlocks = settings.generalSettings.numberOfBlocks;
  } 

}
