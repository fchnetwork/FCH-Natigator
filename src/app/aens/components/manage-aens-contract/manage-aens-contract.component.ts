import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '@aerum/ui';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { AerumNameService } from '@app/aens/services/aerum-name.service';

import Web3 from 'web3';

@Component({
  selector: 'app-manage-aens-contract',
  templateUrl: './manage-aens-contract.component.html',
  styleUrls: ['./manage-aens-contract.component.scss']
})
export class ManageAensContractComponent implements OnInit {

  @Input() price: number;
  transferTo: string;
  widthdrawTo: string;
  balanceInWei: number;

  account: string;

  processing: boolean;

  setPriceForm: FormGroup;
  transferForm: FormGroup;
  widthdrawForm: FormGroup;

  web3: Web3;

  @Output() priceChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private aensService: AerumNameService
  ) { }

  async ngOnInit() {
    const keystore = this.authService.getKeystore();
    this.account  = "0x" + keystore.address;

    this.web3 = this.authService.initWeb3();

    this.transferTo = this.account;
    this.widthdrawTo = this.account;

    this.setPriceForm = this.formBuilder.group({
      price: [null, [Validators.required, Validators.min(0)]]
    });

    this.transferForm = this.formBuilder.group({
      transferTo: [null, [Validators.required, Validators.pattern("^(0x){1}[0-9a-fA-F]{40}$")]]
    });

    this.widthdrawForm = this.formBuilder.group({
      widthdrawTo: [null, [Validators.required, Validators.pattern("^(0x){1}[0-9a-fA-F]{40}$")]]
    });

    this.balanceInWei = await this.aensService.getBalance();
  }

  async setPrice() {
    if(!this.canSetPrice()) {
      console.log('Set price form invalid or other thing in proggress');
      return;
    }
    
    try {
      this.startProcessing();
      this.showProcessingNotification();
      await this.trySetPrice();
      this.notificationService.notify(this.translate('ENS.SUCCESS_TITLE'), `${this.translate('ENS.SET_PRICE_SUCCESS')}: ${this.price} AERO`, 'aerum');
    } catch (e) {
      this.showErrorNotification();
      throw e;
    }
    finally{
      this.stopProcessing();
    }
  }

  async trySetPrice() {
    const newPrice = this.web3.utils.toWei(this.price.toString(10), 'ether');
    await this.aensService.setPrice(newPrice);
    this.priceChange.emit(newPrice);
  }

  async setOwner() {
    if(!this.canTransfer()) {
      console.log('Transfer form invalid or other thing in proggress');
      return;
    }
    
    try {
      this.startProcessing();
      this.showProcessingNotification();
      await this.trySetOwner();
      this.notificationService.notify(this.translate('ENS.SUCCESS_TITLE'), `${this.translate('ENS.SET_OWNER_SUCCESS')}: ${this.transferTo}`, 'aerum');
    } catch (e) {
      this.showErrorNotification();
      throw e;
    }
    finally{
      this.stopProcessing();
    }
  }

  async trySetOwner() {
    await this.aensService.transferOwnership(this.transferTo);
  }

  async widthdraw() {
    if(!this.canWidthdraw()) {
      console.log('Widthdraw form invalid or other thing in proggress');
      return;
    }

    try {
      this.startProcessing();
      this.showProcessingNotification();
      await this.tryWidthdraw();
      this.notificationService.notify(this.translate('ENS.SUCCESS_TITLE'), `${this.translate('ENS.SET_OWNER_SUCCESS')}: ${this.transferTo}`, 'aerum');
    } catch (e) {
      this.showErrorNotification();
      throw e;
    }
    finally{
      this.stopProcessing();
    }
  }

  async tryWidthdraw() {
    // NOTE: Transfer all balance
    await this.aensService.widthdraw(this.widthdrawTo, this.balanceInWei.toString(10));
  }

  hasError(control: FormControl) {
    if(!control) {
      return false;
    }

    return !control.valid && control.touched;
  }

  canSetPrice() {
    return !this.processing && this.setPriceForm.valid;
  }

  canTransfer() {
    return !this.processing && this.transferForm.valid;
  }

  canWidthdraw() {
    return !this.processing && this.widthdrawForm.valid;
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

  showProcessingNotification() {
    this.notificationService.notify(this.translate('ENS.OPERATION_STARTED_TITLE'), this.translate('ENS.OPERATION_IN_PROGRESS'), 'aerum', 3000);
  }

  showErrorNotification() {
    this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), this.translate('ENS.SET_OWNER_ERROR'), 'aerum', 5000);
  }
}
