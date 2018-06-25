import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '@aerum/ui';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { toWei } from 'web3-utils';

import { toBigNumberString } from "@shared/helpers/number-utils";
import { AddressValidator } from "@shared/validators/address.validator";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { AerumNameService } from '@core/aens/aerum-name-service/aerum-name.service';
import { AensBaseComponent } from "@aens/components/aens-base.component";

@Component({
  selector: 'app-aens-contract-manage',
  templateUrl: './aens-contract-manage.component.html',
  styleUrls: ['./aens-contract-manage.component.scss']
})
export class AensContractManageComponent extends AensBaseComponent implements OnInit {

  @Input() account: string;
  @Input() price: number;
  @Output() priceChange: EventEmitter<number> = new EventEmitter<number>();

  transferTo: string;
  withdrawTo: string;
  balanceInWei: number;

  setPriceForm: FormGroup;
  transferForm: FormGroup;
  withdrawForm: FormGroup;

  constructor(
    translateService: TranslateService,
    private logger: LoggerService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private aensService: AerumNameService
  ) { super(translateService); }

  async ngOnInit() {
    this.transferTo = this.account;
    this.withdrawTo = this.account;

    this.setPriceForm = this.formBuilder.group({
      price: [null, [Validators.required, Validators.min(0)]]
    });

    this.transferForm = this.formBuilder.group({
      transferTo: [null, [AddressValidator.isAddress]]
    });

    this.withdrawForm = this.formBuilder.group({
      withdrawTo: [null, [AddressValidator.isAddress]]
    });

    await this.refreshBalance();
  }

  async setPrice() {
    if(!this.canSetPrice()) {
      this.logger.logMessage('Set price form invalid or other thing in progress');
      return;
    }

    try {
      this.startProcessing();
      this.showProcessingNotification();
      await this.trySetPrice();
      this.notificationService.notify(this.translate('ENS.SUCCESS_TITLE'), `${this.translate('ENS.SET_PRICE_SUCCESS')}: ${this.price} AERO`, 'aerum');
    } catch (e) {
      this.showErrorNotification();
      this.logger.logError('Error while setting name price: ', e);
    }
    finally{
      this.stopProcessing();
    }
  }

  async trySetPrice() {
    const newPrice = toWei(toBigNumberString(this.price), 'ether');
    await this.aensService.setPrice(newPrice);
    this.priceChange.emit(newPrice);
  }

  async setOwner() {
    if(!this.canTransfer()) {
      this.logger.logMessage('Transfer form invalid or other thing in progress');
      return;
    }

    try {
      this.startProcessing();
      this.showProcessingNotification();
      await this.trySetOwner();
      this.notificationService.notify(this.translate('ENS.SUCCESS_TITLE'), `${this.translate('ENS.SET_OWNER_SUCCESS')}: ${this.transferTo}`, 'aerum');
    } catch (e) {
      this.showErrorNotification();
      this.logger.logError('Error while setting registrar owner: ', e);
    }
    finally{
      this.stopProcessing();
    }
  }

  async trySetOwner() {
    await this.aensService.transferOwnership(this.transferTo);
  }

  async withdraw() {
    if(!this.canWithdraw()) {
      this.logger.logMessage('Withdraw form invalid or other thing in progress');
      return;
    }

    try {
      this.startProcessing();
      this.showProcessingNotification();
      await this.tryWithdraw();
      this.notificationService.notify(this.translate('ENS.SUCCESS_TITLE'), `${this.translate('ENS.WITHDRAW_SUCCESS')}: ${this.withdrawTo}`, 'aerum');
    } catch (e) {
      this.showErrorNotification();
      this.logger.logError('Error while withdrawing funds: ', e);
    }
    finally{
      this.stopProcessing();
    }
  }

  async tryWithdraw() {
    // NOTE: Transfer all balance
    await this.aensService.withdraw(this.withdrawTo, toBigNumberString(this.balanceInWei));
    await this.refreshBalance();
  }

  async refreshBalance() {
    this.balanceInWei = await this.aensService.getBalance();
    this.logger.logMessage(`ANS contract balance in wei: ${this.balanceInWei}`);
  }

  canSetPrice() {
    return !this.locked && this.setPriceForm.valid;
  }

  canTransfer() {
    return !this.locked && this.transferForm.valid;
  }

  canWithdraw() {
    return !this.locked && this.withdrawForm.valid;
  }

  private showProcessingNotification() {
    this.notificationService.notify(this.translate('ENS.OPERATION_STARTED_TITLE'), this.translate('ENS.OPERATION_IN_PROGRESS'), 'aerum', 3000);
  }

  private showErrorNotification() {
    this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), this.translate('ENS.SET_OWNER_ERROR'), 'aerum', 5000);
  }
}
