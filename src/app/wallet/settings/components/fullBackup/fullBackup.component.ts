import { Component, OnInit } from '@angular/core';
import { SettingsBackupService } from '@app/core/settings/settingsBackup.service';

@Component({
  selector: 'app-fullBackup',
  templateUrl: './fullBackup.component.html',
  styleUrls: ['./fullBackup.component.scss']
})
export class FullBackupComponent implements OnInit {

  constructor(
    private settingsBackupService: SettingsBackupService
  ) { }

  ngOnInit() {
  }

  backup() {
    this.settingsBackupService.fullBackup();
  }

}
