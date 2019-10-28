import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NotificationService, DialogResult } from '@aerum/ui';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { EnvironmentService } from "@core/general/environment-service/environment.service";

import { toBigNumberString } from "@shared/helpers/number-utils";
import { AddressValidator } from "@shared/validators/address.validator";
import { NameBuyConfirmRequest } from '@aens/models/nameBuyConfirmRequest';
import { ModalService } from '@core/general/modal-service/modal.service';
import { LoggerService } from "@core/general/logger-service/logger.service";
import { AerumNameService } from '@core/aens/aerum-name-service/aerum-name.service';
import { TransactionService } from '@core/transactions/transaction-service/transaction.service';
import { AensBaseComponent } from "@aens/components/aens-base.component";
import { StorageService } from "@core/general/storage-service/storage.service";
import { SettingsService } from '@app/core/settings/settings.service';

@Component({
  selector: 'app-name-buy',
  templateUrl: './name-buy.component.html',
  styleUrls: ['./name-buy.component.scss']
})
export class NameBuyComponent extends AensBaseComponent implements OnInit {

  @Output() namePurchased: EventEmitter<string> = new EventEmitter<string>();
  @Input() name: string;
  @Input() price: number;
  @Input() account: string;
  @Input() assignName: boolean;

  currentAccountBalanceInEther: number;

  address: string;
  disableAddress = false;
  buyForm: FormGroup;

  constructor(
    translateService: TranslateService,
    private logger: LoggerService,
    private transactionService: TransactionService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private aensService: AerumNameService,
    private storageService: StorageService,
    private settingsService: SettingsService,
    private environment: EnvironmentService
  ) { super(translateService); }

  async ngOnInit() {
    this.address = this.account;

    this.buyForm = this.formBuilder.group({
      name: [null, [Validators.pattern("^[a-zA-Z0-9-]{5,50}$")]],
      address: [null, [AddressValidator.isAddress]],
      assignName: [false]
    });

    this.currentAccountBalanceInEther = await this.transactionService.checkBalance(this.account);
  }

  async buyName() {
    if(!this.canBuyName()) {
      this.logger.logMessage('Buy form is invalid or other thing in progress');
      return;
    }

    if(!this.hasEnoughFundsForName()) {
      this.logger.logMessage(`Cannot buy name as balance is too low: ${this.currentAccountBalanceInEther} in wei`);
      this.notificationService.notify(this.translate('ENS.NOT_ENOUGH_FUNDS_TITLE'), this.translate('ENS.NOT_ENOUGH_FUNDS'), 'aerum', 5000);
      return;
    }

    try {
      this.startProcessing();
      await this.tryBuyName();
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.BUY_NAME_ERROR')}: ${this.name}.f`, 'aerum', 5000);
      this.logger.logError(`Buying ${this.name} name error: `, e);
    }
    finally{
      this.stopProcessing();
    }
    // NOTE: We fire even after processing so other components are not locked
    this.namePurchased.emit(this.name.trim());
  }

  async tryBuyName() {
    const label = this.name.trim();
    const fullName = label + ".f";
    const nameAddress = this.address;

    const cost = await this.aensService.estimateBuyNameAndSetAddressCost(label, this.account, this.address, toBigNumberString(this.price));
    this.logger.logMessage(`Buy name cost: ${cost}`);

    const buyRequest: NameBuyConfirmRequest = {
      name: fullName,
      amount: this.price,
      buyer: this.account,
      address: nameAddress,
      ansOwner: this.environment.get().contracts.aens.address.FixedPriceRegistrar,
      gasPrice: cost[0],
      estimatedFeeInGas: cost[1],
      maximumFeeInGas: cost[2]
    };
    const modalResult = await this.modalService.openBuyAensConfirm(buyRequest);
    if(modalResult.dialogResult === DialogResult.Cancel) {
      this.logger.logMessage('Name buy cancelled');
      return;
    }

    this.notificationService.notify(this.multiContractsExecutionNotificationTitle(1, 3), `${this.translate('ENS.NOTIFICATION_BODY_BUY_NAME')}: ${fullName}`, 'aerum', 5000);
    await this.aensService.buyName(label, this.account, toBigNumberString(this.price));
    this.notificationService.notify(this.multiContractsExecutionNotificationTitle(2, 3), this.translate('ENS.NOTIFICATION_BODY_SET_RESOLVER'), 'aerum', 5000);
    await this.aensService.setFixedPriceResolver(fullName);
    this.notificationService.notify(this.multiContractsExecutionNotificationTitle(3, 3), `${this.translate('ENS.NOTIFICATION_BODY_SET_ADDRESS')}: ${nameAddress}`, 'aerum', 5000);
    await this.aensService.setAddress(fullName, nameAddress);
    this.notificationService.notify(this.translate('ENS.NAME_BUY_SUCCESS_TITLE'), `${this.translate('ENS.NAME_BUY_SUCCESS')}: ${fullName}`, 'aerum');

    this.storageService.setSessionData('acc_name', label);
    this.settingsService.saveSettings("accountSettings", { accName: label });
  }

  canBuyName() {
    return !this.locked && this.buyForm.valid;
  }

  setAssignName(event) {
    if(!!event) {
      this.address = this.account;
    }
    this.disableAddress = !!event;
  }

  private hasEnoughFundsForName() {
    return Number(this.currentAccountBalanceInEther) >= Number(this.price);
  }
}
