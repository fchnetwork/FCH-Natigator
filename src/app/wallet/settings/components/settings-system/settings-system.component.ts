import { Component, OnInit } from '@angular/core';
import { iSystemSettings, iSettings } from '@shared/app.interfaces';
import { SettingsService } from '@app/core/settings/settings.service';
import { ValidateService } from '@app/core/validation/validate.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-system',
  templateUrl: './settings-system.component.html',
  styleUrls: ['./settings-system.component.scss']
})
export class SettingsSystemComponent implements OnInit {

  systemSettings: iSystemSettings = {
    aerumNodeWsURI: '',
    aerumNodeRpcURI: '',
    ethereumNodeURI: ''
  }

  settingsForm: FormGroup = this.formBuilder.group({});

  constructor(private settingsService: SettingsService,
              private validateService: ValidateService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getSystemSettings();
    const regexURL = "^((ws)(s)?|(http)(s)?)://[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$";
    this.settingsForm = this.formBuilder.group({
      "RPC URL": [null, [Validators.required, Validators.pattern(regexURL)]],
      "Ethereum Node URL": [null, [Validators.required, Validators.pattern(regexURL)]]
    });
  }

  saveSettings() {
    const valid = this.validateService.validateForm(this.settingsForm, 'All fields are valid');
    let settings: iSettings = this.settingsService.getSettings();
    if (valid) {
      const systemSettings: iSystemSettings = {
        aerumNodeWsURI: settings.systemSettings.aerumNodeWsURI,
        aerumNodeRpcURI: this.systemSettings.aerumNodeRpcURI,
        ethereumNodeURI: this.systemSettings.ethereumNodeURI
      };
      this.settingsService.saveSettings("systemSettings", systemSettings);
    }
  }

  getSystemSettings() {
    let settings: iSettings = this.settingsService.getSettings();
    this.systemSettings.aerumNodeWsURI = settings.systemSettings.aerumNodeWsURI;
    this.systemSettings.aerumNodeRpcURI = settings.systemSettings.aerumNodeRpcURI;
    this.systemSettings.ethereumNodeURI = settings.systemSettings.ethereumNodeURI;
  }

}
