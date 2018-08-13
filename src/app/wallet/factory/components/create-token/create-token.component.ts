import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { fromWei } from "web3-utils";
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
import { AerumNameService } from "@core/aens/aerum-name-service/aerum-name.service";
import { toBigNumberString } from "@shared/helpers/number-utils";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.scss']
})
export class CreateTokenComponent implements OnInit {

  private ansPriceInEther: string;
  private ansPriceInWei: string;
  private account: string;

  processing = false;
  address: string;

  createForm: FormGroup;

  constructor(
    private logger: LoggerService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private notificationService: InternalNotificationService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private clipboardService: ClipboardService,
    private tokenFactoryService: TokenFactoryService,
    private tokenService: TokenService,
    private aensService: AerumNameService
  ) { }

  async ngOnInit() {
    this.createForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("^[0-9A-Za-z- ]+$")]],
      symbol: [null, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9A-Z]+$")]],
      supply: [null, [Validators.required, Validators.pattern("^[0-9]{1,18}$"),  Validators.min(1)]],
      decimals: [null, [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0), Validators.max(18)]],
      ansName: [null, [Validators.required, Validators.pattern("^[a-zA-Z0-9-]{5,50}$")]],
    });

    this.account = this.authenticationService.getAddress();
    this.ansPriceInWei = await this.aensService.getPrice();
    this.ansPriceInEther = fromWei(this.ansPriceInWei, 'ether');
  }

  async createToken() {
    // TODO: Validate if ANS name already taken
    if(!this.canCreateToken()) {
      this.logger.logMessage("Cannot create token due to validation issues");
      return;
    }

    try {
      this.processing = true;
      await this.tryCreateToken(this.createForm.value as CreateTokenModel);
      // TODO: Create ANS name here
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

    const [gasPrice, estimatedFeeInGas] = await this.estimateCost(data);
    const createTokenRequest: CreateTokenRequest = {
      name: data.name,
      symbol: data.symbol,
      decimals: data.decimals,
      supply: data.supply,
      ansName: data.ansName + ".aer",
      estimatedFeeInWei: gasPrice * estimatedFeeInGas + Number(this.ansPriceInWei)
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

  private async estimateCost(data: CreateTokenModel): Promise<[number, number, number]> {
    const tokenCost = await this.tokenFactoryService.estimateCreate(data);
    this.logger.logMessage(`Creating new token cost: ${tokenCost}`);

    const label = data.ansName.trim();
    const ansCost = await this.aensService.estimateBuyNameAndSetAddressCost(label, data.ansName.trim(), this.account, this.ansPriceInEther);
    this.logger.logMessage(`Buy token name cost: ${ansCost}`);

    return [
      tokenCost[0], // gas price
      tokenCost[1] + ansCost[1], // estimated fee in gas
      tokenCost[2] + ansCost[2]  // max fee in gas
    ];
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
