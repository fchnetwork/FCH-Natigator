import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '@aerum/ui';
import { TranslateService } from '@ngx-translate/core';

import { fromWei } from 'web3-utils';

import { CheckStatus } from '@core/aens/aerum-name-service/check-status.enum';
import { AensContractManageComponent } from '@aens/components/aens-contract-manage/aens-contract-manage.component';
import { LoggerService } from "@core/general/logger-service/logger.service";
import { AuthenticationService } from '@core/authentication/authentication-service/authentication.service';
import { AerumNameService } from '@core/aens/aerum-name-service/aerum-name.service';
import { ModalService } from '@core/general/modal-service/modal.service';
import {NameCheckedEvent} from "@aens/models/nameCheckedEvent";
import {NameCheckComponent} from "@aens/components/name-check/name-check.component";
import {NameBuyComponent} from "@aens/components/name-buy/name-buy.component";
import {NameUpdateComponent} from "@aens/components/name-update/name-update.component";

@Component({
  selector: 'app-aens-dashboard',
  templateUrl: './aens-dashboard.component.html',
  styleUrls: ['./aens-dashboard.component.scss']
})
export class AensDashboardComponent implements OnInit {

  @ViewChild(NameCheckComponent) nameCheckComponent: NameCheckComponent;
  @ViewChild(NameBuyComponent) nameBuyComponent: NameBuyComponent;
  @ViewChild(NameUpdateComponent) nameUpdateComponent: NameUpdateComponent;
  @ViewChild(AensContractManageComponent) contractManageComponent: AensContractManageComponent;

  currentAccount: string;

  name: string;
  checkedName: string;
  status: CheckStatus = CheckStatus.None;

  price: number;
  isRegistrarOwner: boolean;

  constructor(
    private logger: LoggerService,
    private authService: AuthenticationService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private aensService: AerumNameService
  ) { }

  async ngOnInit() {
    const keystore = this.authService.getKeystore();
    this.currentAccount  = "0x" + keystore.address;
    this.name = 'yourname';

    this.isRegistrarOwner = await this.aensService.isRegistrarOwner(this.currentAccount);
    this.price = fromWei(await this.aensService.getPrice(), 'ether');
  }

  onNameChecked(event: NameCheckedEvent): void {
    this.checkedName = event.name;
    this.status = event.status;
  }

  onProcessing(running: boolean) {
    if(running) {
      this.nameCheckComponent.lock();
      if(this.nameBuyComponent) { this.nameBuyComponent.lock(); }
      if(this.nameUpdateComponent) { this.nameUpdateComponent.lock(); }
      if(this.contractManageComponent) { this.contractManageComponent.lock(); }
    } else {
      this.nameCheckComponent.unlock();
      if(this.nameBuyComponent) { this.nameBuyComponent.unlock(); }
      if(this.nameUpdateComponent) { this.nameUpdateComponent.unlock(); }
      if(this.contractManageComponent) { this.contractManageComponent.unlock(); }
    }
  }

  async onNamePurchased(name: string) {
    await this.nameCheckComponent.checkName(name);
    if(this.contractManageComponent) { await this.contractManageComponent.refreshBalance(); }
  }

  async onNameTransferred(name: string) {
    await this.nameCheckComponent.checkName(name);
  }

  async onNameReleased(name: string) {
    await this.nameCheckComponent.checkName(name);
  }

  onNamePriceChanged(newPrice: number) {
    this.price =  fromWei(newPrice, 'ether');
  }

  isCheckDone() {
    return this.status !== CheckStatus.None;
  }

  isNameAvailable() {
    return this.status === CheckStatus.Available;
  }

  isNameOwner() {
    return this.status === CheckStatus.Owner;
  }
}
