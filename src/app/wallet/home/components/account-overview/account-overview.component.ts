import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { TransactionService } from '@app/core/transactions/transaction-service/transaction.service';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.scss']
})
export class AccountOverviewComponent implements OnInit {
  walletBalance: string;
  addressQR: string;
  address: string;
  name: string;

  constructor(
    private authServ: AuthenticationService,
    private txnServ: TransactionService,
    public notificationService: InternalNotificationService
  ) { }

  userData() {
    return this.authServ.showKeystore().then(
      (keystore) => {
        const getBalance = this.txnServ.checkBalance(keystore.address);
        const getQR = this.authServ.createQRcode( "0x" + keystore.address );
        this.address = "0x" + keystore.address;
        this.name = this.authServ.getName();
        return Promise.all([ keystore, getBalance, getQR ]);
    }
  )
    .then(
      ([ keystore, accBalance, qrCode ]) => {
      this.walletBalance = accBalance;
      this.addressQR     = qrCode;
    }
  );
}

  ngOnInit() {
    this.userData();
  }
}
