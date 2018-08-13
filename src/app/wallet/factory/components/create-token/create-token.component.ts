import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { fromWei } from "web3-utils";
import { DialogResult, NotificationService } from "@aerum/ui";
import { CreateTokenRequest } from "@app/wallet/factory/models/create-token-request.model";
import { CreateTokenModel } from "@app/core/factory/models/create-token.model";
import { ModalService } from "@core/general/modal-service/modal.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { TranslateService } from "@ngx-translate/core";
import { ClipboardService } from "@core/general/clipboard-service/clipboard.service";
import { TokenFactoryService } from "@core/factory/token-factory-service/token-factory.service";
import { TokenService } from "@core/transactions/token-service/token.service";
import { AerumNameService } from "@core/aens/aerum-name-service/aerum-name.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { TransactionService } from "@core/transactions/transaction-service/transaction.service";

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.scss']
})
export class CreateTokenComponent implements OnInit {

  private ansPriceInEther: string;
  private ansPriceInWei: string;
  private account: string;
  private currentAccountBalanceInEther: number;

  processing = false;
  address: string;

  createForm: FormGroup;

  constructor(
    private logger: LoggerService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private clipboardService: ClipboardService,
    private transactionService: TransactionService,
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
    this.currentAccountBalanceInEther = await this.transactionService.checkBalance(this.account);
  }

  async createToken() {
    if(!this.canCreateToken()) {
      this.logger.logMessage("Cannot create token due to validation issues");
      return;
    }

    if(!this.hasEnoughFundsForName()) {
      this.logger.logMessage(`Cannot buy name as balance is too low: ${this.currentAccountBalanceInEther} in wei`);
      this.notify(this.translate('ENS.NOT_ENOUGH_FUNDS_TITLE'), this.translate('ENS.NOT_ENOUGH_FUNDS'));
      return;
    }

    try {
      this.processing = true;
      await this.confirmAndCreateToken(this.createForm.value as CreateTokenModel);
    } catch (e) {
      this.logger.logError('Create token error:', e);
      this.notify(this.translate('ERROR'), this.translate('TOKEN_FACTORY.CREATE.NOTIFICATIONS.ERROR'));
    } finally {
      this.processing = false;
    }
  }

  private async confirmAndCreateToken(data: CreateTokenModel) {
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

    await this.createTokenAndSetAnsName(data);
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

  private async createTokenAndSetAnsName(data: CreateTokenModel) {
    await this.createAndImportToken(data);
    if(this.address) {
      await this.registerAnsName(this.address, data.ansName);
      this.notify(this.translate('DONE'),`${data.name} ${this.translate('TOKEN_FACTORY.CREATE.NOTIFICATIONS.SUCCESS_SUFFIX')}`);
    }
  }

  private async createAndImportToken(data: CreateTokenModel) {
    this.notify(this.multiContractsExecutionNotificationTitle(1, 4), `${this.translate('TOKEN_FACTORY.CREATE.NOTIFICATIONS.CREATING_TOKEN')}: ${data.name}`);
    this.address = await this.tokenFactoryService.create(data);
    if(this.address) {
      await this.tokenService.safeImportToken(this.address);
    }
  }

  private async registerAnsName(address: string, label: string) {
    const fullName = label + ".aer";
    this.notify(this.multiContractsExecutionNotificationTitle(2, 4), `${this.translate('ENS.NOTIFICATION_BODY_BUY_NAME')}: ${fullName}`);
    await this.aensService.buyName(label, this.account, this.ansPriceInEther);
    this.notify(this.multiContractsExecutionNotificationTitle(3, 4), this.translate('ENS.NOTIFICATION_BODY_SET_RESOLVER'));
    await this.aensService.setFixedPriceResolver(fullName);
    this.notify(this.multiContractsExecutionNotificationTitle(4, 4), `${this.translate('ENS.NOTIFICATION_BODY_SET_ADDRESS')}: ${address}`);
    await this.aensService.setAddress(fullName, address);
    this.notify(this.translate('ENS.NAME_BUY_SUCCESS_TITLE'), `${this.translate('ENS.NAME_BUY_SUCCESS')}: ${fullName}`);
  }

  async copyAddress() {
    await this.clipboardService.copy(this.address);
    this.notify(this.translate('DONE'), this.translate('COPIED_TO_CLIPBOARD'));
  }

  canCreateToken() {
    return !this.processing && this.createForm.valid;
  }

  private hasEnoughFundsForName() {
    return Number(this.currentAccountBalanceInEther) >= Number(this.ansPriceInEther);
  }

  hasError(control: AbstractControl): boolean {
    if(!control) {
      return false;
    }

    return !control.valid && control.touched;
  }

  private multiContractsExecutionNotificationTitle(current: number, total: number) {
    return `${this.translate('COMMON.NOTIFICATIONS.CONTRACT.EXECUTING_CONTRACT')} ${current} ${this.translate('COMMON.NOTIFICATIONS.CONTRACT.N_OF')} ${total}`;
  }

  private notify(title: string, message: string) {
    this.notificationService.notify(title, message, 'aerum', 5000);
  }

  private translate(key: string): string {
    return this.translateService.instant(key);
  }
}
