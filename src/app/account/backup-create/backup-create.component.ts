import { Component, OnInit } from '@angular/core';
import { RouteDataService } from '../../shared/services/route-data.service';
import { RegistrationRouteData } from '../models/RegistrationRouteData';
import { AerumBackupFile } from '../../shared/components/file-download/file-download';
import { Router } from '@angular/router';
import { ClipboardService } from '../../shared/services/clipboard.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-backup-create',
  templateUrl: './backup-create.component.html',
  styleUrls: ['./backup-create.component.scss']
})
export class BackupCreateComponent implements OnInit {

  seed: string;

  constructor(private routeDataService: RouteDataService<RegistrationRouteData>,
    private router: Router,
    private clipboardService: ClipboardService,
    private notificationService: NotificationService) {

    if (!routeDataService.hasData()) {
      router.navigate(['account/register']);
    }
  }

  ngOnInit() {
    this.seed = this.routeDataService.routeData.mnemonic;
  }

  private copyToClipboard() {
    this.clipboardService.copy(this.seed);
    this.notificationService.showMessage('Copied to clipboard!');

  }

  private savePhrase() {
    const data = [{ seed: this.seed, }];
    new AerumBackupFile(data, 'AerumBackupSeed');
  }

  private confirmBackup() {
    this.router.navigate(['account/backup/confirm']);
  }
}
