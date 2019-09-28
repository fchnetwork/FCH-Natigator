import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AerumNameService } from '@core/aens/aerum-name-service/aerum-name.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from "@core/general/storage-service/storage.service";
import { AerumbitService } from "@core/aerumbit/aerumbit.service";
import { Status } from "@core/aerumbit/models/request-faucet-data";
import { CheckStatus } from "@core/aens/aerum-name-service/check-status.enum";
import { TranslateService } from "@ngx-translate/core";
import { NotificationService } from '@aerum/ui';
import { SettingsService } from '@app/core/settings/settings.service';

import { fromWei } from 'web3-utils';
import { toBigNumberString } from "@shared/helpers/number-utils";

@Component({
  selector: 'app-register-name',
  templateUrl: './register-name.component.html',
  styleUrls: ['./register-name.component.scss']
})
export class RegisterNameComponent implements OnInit {
  account: string;
  inProgress: boolean;
  nameUsed: boolean;
  price: number;
  registerForm: FormGroup = this.formBuilder.group({});

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public storageService: StorageService,
    private aensService: AerumNameService,
    private aerumbitService: AerumbitService,
    private translateService: TranslateService,
    private settingsService: SettingsService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.account = this.storageService.getSessionData('acc_address');
    this.registerForm = this.formBuilder.group({
      name: [null, [Validators.required]],
    });
    if(!this.aerumbitService.isAvailable()) {
      this.router.navigate(['/account/backup']);
    }
  }

  async onSubmit() {
    try {
      this.inProgress = true;
      if (!this.registerForm.valid) {
        return;
      }
      const name = this.registerForm.value.name;
      const label = name.trim();
      const fullName = label + ".f";
      try {
        const status = await this.tryCheckName(name);
        this.nameUsed = status !== CheckStatus.Available;
        if(this.nameUsed) {
          return;
        }
      } catch(error) {
        this.notificationService.notify(this.translate('ENS.NAME_BUY_ERROR_TITLE'), `${error}: ${label}`, 'aerum', 5000);
        return;
      }
      this.notificationService.notify(this.translate('ACCOUNT.REGISTER_NAME.AERUMBIT_TITLE'), this.translate('ACCOUNT.REGISTER_NAME.REQUESTING_TOKEN'), 'aerum', 5000);
      const tokenData = await this.aerumbitService.requestFaucetToken(this.account);
      if(tokenData.status === Status.Failed) {
        this.notificationService.notify(this.translate('ENS.NAME_BUY_ERROR_TITLE'), this.translate('ACCOUNT.REGISTER_NAME.REQUESTING_AERO'), 'aerum', 5000);
        return;
      }
      this.notificationService.notify(this.translate('ACCOUNT.REGISTER_NAME.AERUMBIT_TITLE'), this.translate('ACCOUNT.REGISTER_NAME.REQUESTING_AERO'), 'aerum', 5000);
      const faucetData = await this.aerumbitService.requestFaucet(tokenData.token);
      if(faucetData.status === Status.Failed) {
        this.notificationService.notify(this.translate('ENS.NAME_BUY_ERROR_TITLE'), this.translate('ACCOUNT.REGISTER_NAME.ERROR_REQUESTING_AERO'), 'aerum', 5000);
        return;
      }
      this.price = fromWei(await this.aensService.getPrice(), 'ether');
      this.notificationService.notify(this.multiContractsExecutionNotificationTitle(1, 3), `${this.translate('ENS.NOTIFICATION_BODY_BUY_NAME')}: ${label}`, 'aerum', 5000);
      await this.aensService.buyName(label, this.account, toBigNumberString(this.price));
      this.notificationService.notify(this.multiContractsExecutionNotificationTitle(2, 3), this.translate('ENS.NOTIFICATION_BODY_SET_RESOLVER'), 'aerum', 5000);
      await this.aensService.setFixedPriceResolver(label);
      this.notificationService.notify(this.multiContractsExecutionNotificationTitle(3, 3), `${this.translate('ENS.NOTIFICATION_BODY_SET_ADDRESS')}: ${this.account}`, 'aerum', 5000);
      await this.aensService.setAddress(label, this.account);
      this.notificationService.notify(this.translate('ENS.NAME_BUY_SUCCESS_TITLE'), `${this.translate('ENS.NAME_BUY_SUCCESS')}: ${label}`, 'aerum', 5000);

      this.storageService.setSessionData('acc_name', label);
      this.settingsService.saveSettings("accountSettings", { accName: label });

      this.router.navigate(['/account/backup']);
    } finally {
      this.inProgress = false;
    }
  }

  async tryCheckName(name: string): Promise<CheckStatus> {
    const trimmedName = name.trim();
    const fullName = trimmedName + ".f";
    return await this.aensService.checkStatus(this.account, fullName);
  }

  skipStep() {
    this.router.navigate(['/account/backup']);
  }

  private multiContractsExecutionNotificationTitle(current: number, total: number) {
    return `${this.translate('COMMON.NOTIFICATIONS.CONTRACT.EXECUTING_CONTRACT')} ${current} ${this.translate('COMMON.NOTIFICATIONS.CONTRACT.N_OF')} ${total}`;
  }

  private translate(key: string): string {
    return this.translateService.instant(key);
  }
}
