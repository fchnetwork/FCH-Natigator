import { Component, OnInit } from '@angular/core';
import { SettingsBackupService } from '@app/core/settings/settingsBackup.service';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { StorageService } from '@app/core/general/storage-service/storage.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-settings-backup',
  templateUrl: './settings-backup.component.html',
  styleUrls: ['./settings-backup.component.scss']
})
export class SettingsBackupComponent implements OnInit {
  mnemonicQr: string;

  constructor(
    private settingsBackupService: SettingsBackupService,
    private storageService: StorageService) { }

  async ngOnInit() {
    this.mnemonicQr = await this.generateQrCode();
  }

  async generateQrCode(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const qrCode = QRCode.toDataURL(this.storageService.getSessionData('seed'));
        resolve(qrCode);
      } catch (e) {
        reject(e);
      }
    });
  }

  simpleBackup() {
    this.settingsBackupService.simpleBackup();
  }

  fullBackup() {
    this.settingsBackupService.fullBackup();
  }

}
