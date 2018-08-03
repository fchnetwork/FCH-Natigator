import { Component, Input, Output, EventEmitter } from '@angular/core';

import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";

@Component({
  selector: 'app-ethereum-wallet-account-import',
  templateUrl: './ethereum-wallet-account-import.component.html',
  styleUrls: ['./ethereum-wallet-account-import.component.scss']
})
export class EthereumWalletAccountImportComponent {
  privateKey: string;
  @Input() storedAccounts: EthereumAccount[] = [];
  @Output() importedAccountCreated: EventEmitter<EthereumAccount> = new EventEmitter<EthereumAccount>();

  constructor(private authenticationService: AuthenticationService,
    private notificationService: InternalNotificationService)
  { }

  import() {
    if (this.privateKey) {
      if (!this.privateKey.startsWith('0x')) {
        this.privateKey = `0x${this.privateKey}`;
      }
      try{
        const importedAddress = this.authenticationService.generateAddressFromPrivateKey(this.privateKey);
        const isAlreadyImported = this.storedAccounts.some((acc => acc.address === importedAddress));
        if (isAlreadyImported) {
          this.notificationService.showMessage('Account already imported', 'Error');
          return;
        }
        const importedAccount: EthereumAccount = {address: importedAddress, privateKey: this.privateKey};
        this.importedAccountCreated.emit(importedAccount);
      }catch (err) {
        this.notificationService.showMessage(err, 'Error');
      }
    }
  }
}
