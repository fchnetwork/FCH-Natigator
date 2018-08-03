import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NotificationService, DialogResult } from '@aerum/ui';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AddressValidator } from "@shared/validators/address.validator";
import { SetAddressConfirmRequest } from '@aens/models/setAddressConfirmRequest';
import { NameReleaseConfirmRequest } from "@aens/models/nameReleaseConfirmRequest";
import { NameTransferConfirmRequest } from "@aens/models/nameTransferConfirmRequest";
import { ConfirmResponse } from '@aens/models/confirmResponse';
import { AensBaseComponent } from "@aens/components/aens-base.component";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { ModalService } from '@core/general/modal-service/modal.service';
import { AerumNameService } from '@core/aens/aerum-name-service/aerum-name.service';


@Component({
  selector: 'app-name-update',
  templateUrl: './name-update.component.html',
  styleUrls: ['./name-update.component.scss']
})
export class NameUpdateComponent extends AensBaseComponent implements OnInit {

  @Output() nameReleased: EventEmitter<string> = new EventEmitter<string>();
  @Output() nameTransferred: EventEmitter<string> = new EventEmitter<string>();
  @Input() name: string;
  @Input() account: string;
  fullName: string;

  address: string;
  oldAddress: string;
  newOwner: string;

  setAddressForm: FormGroup;
  transferForm: FormGroup;

  constructor(
    translateService: TranslateService,
    private logger: LoggerService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private aensService: AerumNameService,
  ) { super(translateService); }

  async ngOnInit() {
    this.fullName = this.name.trim() + ".aer";

    this.setAddressForm = this.formBuilder.group({
      address: [null, [AddressValidator.isAddress]]
    });

    this.transferForm = this.formBuilder.group({
      address: [null, [AddressValidator.isAddress]],
      newAddress: [null, [AddressValidator.isAddress]]
    });

    this.oldAddress = await this.aensService.resolveAddressFromName(this.fullName);
    this.address = this.oldAddress;
  }

  async setAddress() {
    if(!this.canSetAddress()) {
      this.logger.logMessage('Change address form is invalid or other thing is in progress');
      return;
    }

    try {
      this.startProcessing();
      await this.trySetAddress();
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.CHANGE_ADDRESS_ERROR')}: ${this.fullName}`, 'aerum', 5000);
      this.logger.logError('Set address error:', e);
    }
    finally{
      this.stopProcessing();
    }
  }

  async trySetAddress() {
    const cost = await this.aensService.estimateSetAddressCost(this.fullName, this.address);
    this.logger.logMessage(`Update address cost: ${cost}`);

    const updateRequest: SetAddressConfirmRequest = {
      name: this.fullName,
      oldAddress: this.oldAddress,
      newAddress: this.address,
      gasPrice: cost[0],
      estimatedFeeInGas: cost[1],
      maximumFeeInGas: cost[2]
    };
    const modalResult = await this.modalService.openSetAensAddressConfirm(updateRequest);
    if(modalResult.dialogResult === DialogResult.Cancel) {
      this.logger.logMessage('Update address cancelled');
      return;
    }

    this.notificationService.notify(this.translate('ENS.OPERATION_STARTED_TITLE'), this.translate('ENS.OPERATION_IN_PROGRESS'), 'aerum', 3000);
    await this.aensService.setAddress(this.fullName, this.address);
    this.notificationService.notify(this.translate('ENS.CHANGE_ADDRESS_SUCCESS_TITLE'), `${this.translate('ENS.CHANGE_ADDRESS_SUCCESS')}: ${this.fullName}`, 'aerum');
  }

  async transfer() {
    if(!this.canReleaseName()) {
      this.logger.logMessage('Transfer name form is invalid or other thing is in progress');
      return;
    }

    try {
      this.startProcessing();
      await this.tryTransfer();
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.TRANSFER_NAME_ERROR')}: ${this.fullName}`, 'aerum', 5000);
      this.logger.logError('Transfer name error:', e);
    }
    finally{
      this.stopProcessing();
    }
    this.nameTransferred.emit(this.name);
  }

  async tryTransfer() {
    const newOwnerAddress = await this.aensService.resolveAddressFromName(this.newOwner);
    const cost = await this.aensService.estimateTransferNameCost(this.fullName);
    this.logger.logMessage(`Transfer name cost: ${cost}`);

    const transferRequest: NameTransferConfirmRequest = {
      name: this.fullName,
      newOwner: newOwnerAddress,
      gasPrice: cost[0],
      estimatedFeeInGas: cost[1],
      maximumFeeInGas: cost[2]
    };
    const modalResult = await this.modalService.openTransferAensNameConfirm(transferRequest);
    if(modalResult.dialogResult === DialogResult.Cancel) {
      this.logger.logMessage('Transfer name cancelled');
      return;
    }

    this.notificationService.notify(this.multiContractsExecutionNotificationTitle(1, 2), `${this.translate('ENS.NOTIFICATION_SET_ADDRESS')}: ${newOwnerAddress}`, 'aerum', 5000);
    await this.aensService.setAddress(this.fullName, newOwnerAddress);
    this.notificationService.notify(this.multiContractsExecutionNotificationTitle(2, 2), `${this.translate('ENS.NOTIFICATION_SET_OWNER')}: ${newOwnerAddress}`, 'aerum', 5000);
    await this.aensService.setOwner(this.fullName, newOwnerAddress);
    this.notificationService.notify(this.translate('ENS.NAME_TRANSFER_SUCCESS_TITLE'), `${this.translate('ENS.NAME_TRANSFER_SUCCESS')}: ${this.name}.aer`, 'aerum');
  }

  async releaseName() {
    if(!this.canReleaseName()) {
      this.logger.logMessage('Release name is not possible as other operation in progress');
      return;
    }

    try {
      this.startProcessing();
      await this.tryReleaseName();
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.RELEASE_NAME_ERROR')}: ${this.fullName}`, 'aerum', 5000);
      this.logger.logError('Release name error:', e);
    }
    finally{
      this.stopProcessing();
    }
    this.nameReleased.emit(this.name);
  }

  async tryReleaseName() {
    const cost = await this.aensService.estimateReleaseNameCost(this.fullName);
    this.logger.logMessage(`Release name cost: ${cost}`);

    const releaseRequest: NameReleaseConfirmRequest = {
      name: this.fullName,
      gasPrice: cost[0],
      estimatedFeeInGas: cost[1],
      maximumFeeInGas: cost[2]
    };

    const modalResult = await this.modalService.openReleaseAensNameConfirm(releaseRequest);

    if(modalResult.dialogResult === DialogResult.Cancel) {
      this.logger.logMessage('Release name cancelled');
      return;
    }

    this.notificationService.notify(this.multiContractsExecutionNotificationTitle(1, 3), `${this.translate('ENS.NOTIFICATION_BODY_CLEAN_ADDRESS')}: ${this.fullName}`, 'aerum', 5000);
    await this.aensService.clearAddress(this.fullName);
    this.notificationService.notify(this.multiContractsExecutionNotificationTitle(2, 3), this.translate('ENS.NOTIFICATION_BODY_CLEAN_RESOLVER'), 'aerum', 5000);
    await this.aensService.clearResolver(this.fullName);
    this.notificationService.notify(this.multiContractsExecutionNotificationTitle(3, 3), this.translate('ENS.NOTIFICATION_BODY_RELEASE_NAME'), 'aerum', 5000);
    await this.aensService.cleanOwner(this.fullName);
    this.notificationService.notify(this.translate('ENS.NAME_RELEASE_SUCCESS_TITLE'), `${this.translate('ENS.NAME_RELEASE_SUCCESS')}: ${this.name}.aer`, 'aerum');
  }

  canSetAddress() {
    return !this.locked && this.setAddressForm.valid;
  }

  canTransfer() {
    return !this.locked && this.transferForm.valid;
  }

  canReleaseName() {
    return !this.locked;
  }
}
