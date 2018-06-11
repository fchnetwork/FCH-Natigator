import { Component, OnInit } from '@angular/core';
import { SettingsBackupService } from '@app/core/settings/settingsBackup.service';

@Component({
  selector: 'app-simpleBackup',
  templateUrl: './simpleBackup.component.html',
  styleUrls: ['./simpleBackup.component.scss']
})
export class SimpleBackupComponent implements OnInit {

  constructor(
    private settingsBackupService: SettingsBackupService
  ) { }

  ngOnInit() {
  }

  backup() {
    this.settingsBackupService.simpleBackup();
  }

}
