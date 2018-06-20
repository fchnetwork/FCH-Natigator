import { Component, OnInit } from '@angular/core';
import { SettingsBackupService } from '@app/core/settings/settingsBackup.service';

@Component({
  selector: 'app-settingsBackup',
  templateUrl: './settingsBackup.component.html',
  styleUrls: ['./settingsBackup.component.scss']
})
export class SettingsBackupComponent implements OnInit {

  constructor(private settingsBackupService: SettingsBackupService) { }

  ngOnInit() {
  }

  simpleBackup() {
    this.settingsBackupService.simpleBackup();
  }

  fullBackup() {
    this.settingsBackupService.fullBackup();
  }

}
