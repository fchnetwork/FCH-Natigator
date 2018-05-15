import { Component, OnInit } from '@angular/core'; 
import { SessionStorageService } from 'ngx-webstorage';    
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { TransactionService } from '@app/core/transaction-service/transaction.service';
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';

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
    private txnServ: TransactionService,
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
