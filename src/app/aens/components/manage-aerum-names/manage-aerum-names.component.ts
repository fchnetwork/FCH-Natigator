import { Component, OnInit } from '@angular/core';

import { NotificationService } from '@aerum/ui';
import { TranslateService } from '@ngx-translate/core';

import { ModalService } from '@app/shared/services/modal.service';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { Address } from 'cluster';
import { timeHour } from 'd3-time';

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

  isOwner: boolean;
  newPrice: number;
  transferTo: string;

  constructor(
    private authService: AuthenticationService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) 
    { }

  ngOnInit() {
    const keystore = this.authService.getKeystore();
    this.account  = "0x" + keystore.address;
    this.transferTo = this.account;

    // TODO: Test code. Remove later
    this.name = 'asrcrypto';
    this.price = 0.01;
    this.newPrice = this.price;
    this.isOwner = true;
  }

  async checkName() {
    try {
      this.startProcessing();
      await this.tryCheckName();
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.CHECK_NAME_ERROR')}: ${this.name}.aer`, 'aerum', 5000);
      throw e;
    }
    finally{
      this.stopProcessing();
    }
  }

  async tryCheckName() {
    // TODO: Test code. Remove later
    this.nameFound = true;
    this.nameAvailable = !this.nameAvailable;
  }

  async buyName() {
    try {
      this.startProcessing();
      await this.tryBuyName();
      this.notificationService.notify(this.translate('ENS.NAME_BUY_SUCCESS_TITLE'), `${this.translate('ENS.NAME_BUY_SUCCESS')}: ${this.name}.aer`, 'aerum');
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.BUY_NAME_ERROR')}: ${this.name}.aer`, 'aerum', 5000);
      throw e;
    }
    finally{
      this.stopProcessing();
    }
  }

  async tryBuyName() {
    const modalResult = await this.modalService.openBuyAensConfirm();
    if(!modalResult.confirmed) {
      console.log('Name buy cancelled');
      return;
    }

    // TODO: buy
  }

  async setPrice() {
    try {
      this.startProcessing();
      await this.trySetPrice();
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.SET_PRICE_ERROR')}: ${this.name}.aer`, 'aerum', 5000);
      throw e;
    }
    finally{
      this.stopProcessing();
    }
  }

  async trySetPrice() {

  }

  async setOwner() {
    try {
      this.startProcessing();
      await this.trySetOwner();
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.SET_OWNER_ERROR')}: ${this.name}.aer`, 'aerum', 5000);
      throw e;
    }
    finally{
      this.stopProcessing();
    }
  }

  async trySetOwner() {

  }

  private startProcessing() {
    this.processing = true;
  }

  private stopProcessing() {
    this.processing = false;
  }

  private translate(key: string) {
    return this.translateService.instant(key);
  }
}
