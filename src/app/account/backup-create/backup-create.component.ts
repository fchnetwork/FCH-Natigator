import { Component, OnInit } from '@angular/core'; 
import { RegistrationRouteData } from '../models/RegistrationRouteData';
import { AerumBackupFile } from '../../shared/components/file-download/file-download';
import { Router } from '@angular/router'; 
import { ClipboardService } from '@app/core/clipboard-service/clipboard.service';
import { RouteDataService } from '@app/core/route-data-service/route-data.service'; 
import { InternalNotificationService } from '@app/core/internal-notification-service/internal-notification.service';

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
    private notificationService: InternalNotificationService) {

    if (!routeDataService.hasData()) {
      router.navigate(['account/register']);
    }
  }

  ngOnInit() {
    this.seed = this.routeDataService.routeData.mnemonic;
  }

  public copyToClipboard() {
    this.clipboardService.copy(this.seed);
    this.notificationService.showMessage('Copied to clipboard!');

  }

  public savePhrase() {
    const data = [{ seed: this.seed, }];
    console.log(data);
    new AerumBackupFile(data, 'AerumBackupSeed');
  }

  public confirmBackup() {
    this.router.navigate(['account/backup/confirm']);
  }
}
