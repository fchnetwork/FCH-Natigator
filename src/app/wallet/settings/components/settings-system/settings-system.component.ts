import { Component, OnInit } from '@angular/core';
import { iSystemSettings, iSettings } from '@shared/app.interfaces';
import { SettingsService } from '@app/core/settings/settings.service';

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

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.getSystemSettings();
  }

  saveSettings() {
    const systemSettings: iSystemSettings = {
      aerumNodeWsURI: this.systemSettings.aerumNodeWsURI,
      aerumNodeRpcURI: this.systemSettings.aerumNodeRpcURI,
      ethereumNodeURI: this.systemSettings.ethereumNodeURI
    };
    this.settingsService.saveSettings("systemSettings", systemSettings);
  }

  getSystemSettings() {
    let settings: iSettings = this.settingsService.getSettings();
    this.systemSettings.aerumNodeWsURI = settings.systemSettings.aerumNodeWsURI;
    this.systemSettings.aerumNodeRpcURI = settings.systemSettings.aerumNodeRpcURI;
    this.systemSettings.ethereumNodeURI = settings.systemSettings.ethereumNodeURI;
  }

}
