import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RegistrationRouteData } from "../models/RegistrationRouteData";
import { BackupDisclamerComponent } from "../backup-disclamer/backup-disclamer.component";
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { RouteDataService } from "@app/core/general/route-data-service/route-data.service";
import { ModalService } from "@app/core/general/modal-service/modal.service";

@Component({
  selector: "app-backup-prompt",
  templateUrl: "./backup-prompt.component.html",
  styleUrls: ["./backup-prompt.component.scss"]
})
export class BackupPromptComponent implements OnInit {
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private routeDataService: RouteDataService<RegistrationRouteData>,
    private modalService: ModalService,
    private router: Router,
    private authService: AuthenticationService
  ) {
    if (!routeDataService.hasData()) {
      router.navigate(["account/register"]);
    } else {
      this.returnUrl = routeDataService.routeData.returnUrl;
    }
  }

  ngOnInit() {}

  createBackup() {
    this.modalService.openModal(BackupDisclamerComponent).then(result => {
      this.router.navigate(["account/backup/create"]);
    });
  }

  skipStep() {
    const data = this.routeDataService.routeData;
    this.authService.saveKeyStore(
      data.privateKey,
      data.password,
      data.mnemonic
    );

    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.router.navigate(["/"]);
    }
  }
}
