import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RouteDataService } from "@app/core/general/route-data-service/route-data.service";
import { QrRouteData } from "@app/account/qr-scan/qr-route-data.model";

@Component({
  selector: "app-qr-scan",
  templateUrl: "./qr-scan.component.html",
  styleUrls: ["./qr-scan.component.scss"]
})
export class QrScanComponent implements OnInit {
  returnUrl: string;

  constructor(
    public routeDataSerice: RouteDataService<QrRouteData>,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || null;
  }

  codeScanned(qrCode) {
    this.routeDataSerice.routeData = {
      qrCode: qrCode
    };

    if (this.returnUrl == null) {
      this.router.navigate(["/account/restore"]);
    } else {
      this.router.navigate(["/account/restore"], {
        queryParams: { returnUrl: this.returnUrl }
      });
    }
  }

  restoreAccount() {
    this.router.navigate(["/account/restore"]);
  }
}
