import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { TransactionServiceService } from '@app/transaction/services/transaction-service/transaction-service.service';
import { SessionStorageService } from 'ngx-webstorage';
import { ClipboardService } from '@app/shared/services/clipboard.service';
import { InternalNotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.scss']
})
export class AccountOverviewComponent implements OnInit {
  walletBalance: string;
  addressQR: string;
  address: string;

  constructor(
    private authServ: AuthenticationService,
    private txnServ: TransactionServiceService,
    public clipboardService: ClipboardService,
    public notificationService: InternalNotificationService,
  ) { }

  userData() {
    return this.authServ.showKeystore().then( 
      (keystore) => {
        const getBalance = this.txnServ.checkBalance(keystore.address);
        const getQR      = this.authServ.createQRcode( "0x" + keystore.address );  
        this.address = keystore.address;
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

  copyToClipboard() {
    this.clipboardService.copy(`0x${this.address}`);
    this.notificationService.showMessage('Copied to clipboard!');

  }

}
