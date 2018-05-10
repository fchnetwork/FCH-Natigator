import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from '@aerum/ui';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';

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

  constructor(
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    const keystore = this.authService.getKeystore();
    this.account  = "0x" + keystore.address;

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

    // TODO: Test code here
    this.balanceInWei = 10000000000000000000;
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
    // TODO: set price
    await this.timeout(2000);
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
    // TODO: transfer
    await this.timeout(2000);
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
    // TODO: transfer
    await this.timeout(5000);
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

  // TODO: Test method
  private timeout(time: number) : Promise<number> {
    return new Promise((resolve) => setTimeout(() => resolve(time), time));
  }
}
