import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DialogResult } from "@aerum/ui";
import { CreateTokenRequest } from "@app/wallet/factory/models/create-token-request.model";
import { CreateTokenModel } from "@app/core/factory/models/create-token.model";
import { ModalService } from "@core/general/modal-service/modal.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { TranslateService } from "@ngx-translate/core";
import { ClipboardService } from "@core/general/clipboard-service/clipboard.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { TokenFactoryService } from "@core/factory/token-factory-service/token-factory.service";
import { TokenService } from "@core/transactions/token-service/token.service";

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.scss']
})
export class CreateTokenComponent implements OnInit {

  processing = false;
  address: string;

  createForm: FormGroup;

  constructor(
    private logger: LoggerService,
    private modalService: ModalService,
    private notificationService: InternalNotificationService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private clipboardService: ClipboardService,
    private tokenFactoryService: TokenFactoryService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("^[0-9A-Za-z- ]+$")]],
      symbol: [null, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9A-Z]+$")]],
      supply: [null, [Validators.required, Validators.pattern("^[0-9]{1,18}$"),  Validators.min(1)]],
      decimals: [null, [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0), Validators.max(18)]]
    });
  }

  async createToken() {
    if(!this.canCreateToken()) {
      this.logger.logMessage("Cannot create token due to validation issues");
      return;
    }

    try {
      this.processing = true;
      await this.tryCreateToken(this.createForm.value as CreateTokenModel);
    } catch (e) {
      this.logger.logError('Create token error:', e);
      this.notificationService.showMessage(this.translate('TOKEN_FACTORY.CREATE.NOTIFICATIONS.ERROR'), this.translate('ERROR'));
    } finally {
      this.processing = false;
    }
  }

  private async tryCreateToken(data: CreateTokenModel) {
    this.logger.logMessage("Creating new token", data);
    this.address = null;

    const cost = await this.tokenFactoryService.estimateCreate(data);
    this.logger.logMessage(`Creating new token cost: ${cost}`);

    const createTokenRequest: CreateTokenRequest = {
      name: data.name,
      symbol: data.symbol,
      decimals: data.decimals,
      supply: data.supply,
      gasPrice: cost[0],
      estimatedFeeInGas: cost[1],
      maximumFeeInGas: cost[2]
    };

    const modalResult = await this.modalService.openCreateTokenConfirm(createTokenRequest);
    if(modalResult.dialogResult === DialogResult.Cancel) {
      this.logger.logMessage('Creating new token cancelled');
      return;
    }

    this.notificationService.showMessage(`${data.name} ${this.translate('TOKEN_FACTORY.CREATE.NOTIFICATIONS.OPERATION_IN_PROGRESS_SUFFIX')}`, this.translate('TOKEN_FACTORY.CREATE.NOTIFICATIONS.OPERATION_IN_PROGRESS'));
    this.address = await this.tokenFactoryService.create(data);
    if(this.address) {
      await this.tokenService.safeImportToken(this.address);
    }
    this.notificationService.showMessage(`${data.name} ${this.translate('TOKEN_FACTORY.CREATE.NOTIFICATIONS.SUCCESS_SUFFIX')}`, this.translate('DONE'));
  }

  async copyAddress() {
    await this.clipboardService.copy(this.address);
    this.notificationService.showMessage(this.translate('COPIED_TO_CLIPBOARD'), this.translate('DONE'));
  }

  canCreateToken() {
    return !this.processing && this.createForm.valid;
  }

  hasError(control: AbstractControl): boolean {
    if(!control) {
      return false;
    }

    return !control.valid && control.touched;
  }

  private translate(key: string): string {
    return this.translateService.instant(key);
  }
}
