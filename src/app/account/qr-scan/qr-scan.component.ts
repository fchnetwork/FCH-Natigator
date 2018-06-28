import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteDataService } from '@app/core/general/route-data-service/route-data.service';
import { QrRouteData } from '@app/account/qr-scan/qr-route-data.model';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.component.html',
  styleUrls: ['./qr-scan.component.scss']
})
export class QrScanComponent implements OnInit {

  constructor(public routeDataSerice: RouteDataService<QrRouteData>, public router: Router) { }

  ngOnInit() {
  }

  codeScanned(qrCode) {
    this.routeDataSerice.routeData = {
      qrCode: qrCode
    };

    this.router.navigate(['/account/restore']);
  }

  restoreAccount() {
    this.router.navigate(['/account/restore']);
  }

}
