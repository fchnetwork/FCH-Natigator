import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { CreateTokenModel } from "@app/core/factory/models/create-token.model";
import { ModalService } from "@core/general/modal-service/modal.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { TokenFactoryService } from "@core/factory/token-factory-service/token-factory.service";
import { TranslateService } from "@ngx-translate/core";
import { ClipboardService } from "@core/general/clipboard-service/clipboard.service";

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
    private tokenFactoryService: TokenFactoryService,
    private clipboardService: ClipboardService
  ) { }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("^[0-9A-Za-z- ]+$")]],
      symbol: [null, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9A-Z]+$")]],
      supply: [null, [Validators.required, Validators.pattern("^[0-9]{1,10}$"),  Validators.min(1)]],
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
      const data = this.createForm.value as CreateTokenModel;
      await this.tryCreateToken(data);
      this.notificationService.showMessage(`${data.name} ${this.translate('TOKEN_FACTORY.CREATE.NOTIFICATIONS.SUCCESS_SUFFIX')}`, this.translate('DONE'));
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
    this.address = await this.tokenFactoryService.create(data);
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
