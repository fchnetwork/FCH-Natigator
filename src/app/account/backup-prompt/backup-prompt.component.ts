import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteDataService } from '../../shared/services/route-data.service';
import { RegistrationRouteData } from '../models/RegistrationRouteData';
import { ModalService } from '../../shared/services/modal.service';
import { BackupDisclamerComponent } from '../backup-disclamer/backup-disclamer.component';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';

@Component({
  selector: 'app-backup-prompt',
  templateUrl: './backup-prompt.component.html',
  styleUrls: ['./backup-prompt.component.scss']
})
export class BackupPromptComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private routeDataService: RouteDataService<RegistrationRouteData>,
    private modalService: ModalService,
    private router: Router,
    private authService: AuthenticationService,
  ) {
      
    if (!routeDataService.hasData()) {
      router.navigate(['account/register']);
    }
  }

  ngOnInit() {
    console.log(this.routeDataService.routeData);
  }

  createBackup() {
    this.modalService.openBackupDisclaimerModal().then((result) => {
      this.router.navigate(['account/backup/create']);
    });
  }

  skipStep() {
    const data = this.routeDataService.routeData;
    this.authService.saveKeyStore( data.privateKey, data.password, data.mnemonic );
  }
}
