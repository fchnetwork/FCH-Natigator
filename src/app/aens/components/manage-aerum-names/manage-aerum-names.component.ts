import { Component, OnInit } from '@angular/core';

import { NotificationService } from '@aerum/ui';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';

@Component({
  selector: 'app-manage-aerum-names',
  templateUrl: './manage-aerum-names.component.html',
  styleUrls: ['./manage-aerum-names.component.scss']
})
export class ManageAerumNamesComponent implements OnInit {

  name: string;
  account: string;

  price: number;
  nameFound: boolean;
  nameAvailable: boolean;
  processing: boolean;

  constructor(
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) 
    { }

  ngOnInit() {
    const keystore = this.authService.getKeystore();
    this.account  = "0x" + keystore.address;

    // TODO: Test code. Remove later
    this.name = 'asrcrypto';
    this.price = 0.01;
  }

  async checkName() {
    try {
      await this.tryCheckName();
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.CHECK_NAME_ERROR')}: ${this.name}.aer`, 'aerum', 5000);
      throw e;
    }
  }

  async tryCheckName() {
    // TODO: Test code. Remove later
    this.nameFound = true;
    this.nameAvailable = !this.nameAvailable;
  }

  async buyName() {
    try {
      await this.tryBuyName();
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.BUY_NAME_ERROR')}: ${this.name}.aer`, 'aerum', 5000);
      throw e;
    }
  }

  async tryBuyName() {

  }

  private translate(key: string) {
    return this.translateService.instant(key);
  }

}
