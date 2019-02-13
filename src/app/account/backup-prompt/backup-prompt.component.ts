import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RegistrationRouteData } from "../models/RegistrationRouteData";
import { BackupDisclamerComponent } from "../backup-disclamer/backup-disclamer.component";
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { RouteDataService } from "@app/core/general/route-data-service/route-data.service";
import { ModalService } from "@app/core/general/modal-service/modal.service";
import { UniversalLinkService } from "@mobile/universal-link/universal-link.service";

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
    private authService: AuthenticationService,
    private universalLinkService: UniversalLinkService
  ) {
    if (!routeDataService.hasData()) {
      router.navigate(["account/register"]);
    } else {
      this.returnUrl = routeDataService.routeData.returnUrl;
    }
  }

  ngOnInit() {}

  async createBackup() {
    await this.modalService.openBackupDisclaimerModal();
    this.router.navigate(["account/backup/create"]);
  }

  async skipStep() {
    const data = this.routeDataService.routeData;
    await this.authService.saveKeyStore(
      data.privateKey,
      data.password,
      data.mnemonic
    );

    this.routeDataService.clear();

    const universalUrl = this.universalLinkService.getLink(true);
    this.returnUrl = !!universalUrl ? universalUrl : this.returnUrl;
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.router.navigate(["/"]);
    }
  }
}
