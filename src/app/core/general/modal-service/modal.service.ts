import { TranslateService } from "@ngx-translate/core";
import { Injectable, Type } from "@angular/core";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";
import { AddTokenComponent } from "@app/wallet/home/components/add-token/add-token.component";
import { CreateSwapConfirmComponent } from "@app/wallet/swap/components/create-swap/create-swap-confirm/create-swap-confirm.component";
import { LoadSwapConfirmComponent } from "@app/wallet/swap/components/load-swap/load-swap-confirm/load-swap-confirm.component";
import { BackupDisclamerComponent } from "@app/account/backup-disclamer/backup-disclamer.component";
import { NameBuyConfirmComponent } from "@app/wallet/aens/components/name-buy-confirm/name-buy-confirm.component";
import { NameUpdateAddressConfirmComponent } from "@app/wallet/aens/components/name-update-address-confirm/name-update-address-confirm.component";
import { NameTransferConfirmComponent } from "@aens/components/name-transfer-confirm/name-transfer-confirm.component";
import { NameReleaseConfirmComponent } from "@aens/components/name-release-confirm/name-release-confirm.component";
import {
  BlockModalComponent,
  BlockModalData
} from "@app/shared/modals/block-modal/block-modal.component";
import {
  TransactionModalComponent,
  TransactionModalData
} from "@app/shared/modals/transaction-modal/transaction-modal.component";
import {
  TransactionSignModalComponent,
  TransactionSignData,
  TransactionSignResponse
} from "@app/shared/modals/transaction-sign-modal/transaction-sign-modal.component";
import { ModalService as UiModalService, DialogResponse } from "@aerum/ui";
import { ModalViewComponent } from "@aerum/ui";
import { CreateSwapComponent } from "@app/wallet/swap/components/create-swap/create-swap.component";

@Injectable()
export class ModalService {
  constructor(
    public uiModalService: UiModalService,
    public translate: TranslateService
  ) {}

  async open<
    TModalData,
    TModalResponse,
    TModalComponent extends ModalViewComponent<TModalData, TModalResponse>
  >(
    titleLanguageResourceKey: string,
    component: Type<TModalComponent>,
    data: TModalData
  ) {
    return this.uiModalService.open<
      TModalData,
      TModalResponse,
      TModalComponent
    >(this.translate.instant(titleLanguageResourceKey), component, data);
  }

  async openViewOnly<TModalComponent extends ModalViewComponent<any, any>>(
    titleLanguageResoureKey: string,
    component: Type<TModalComponent>
  ) {
    return this.uiModalService.open<any, any, TModalComponent>(
      this.translate.instant(titleLanguageResoureKey),
      component,
      {}
    );
  }

  openModal(modal: any, config: any = {}): Promise<any> {
    // let defaultConfig = {
    //   isBlocking: false,
    //   dialogClass: 'adaptive-dialog'
    // };

    // Object.assign(defaultConfig, config);

    // const overlayConfig = overlayConfigFactory(defaultConfig, BSModalContext);
    // return this.modal.open(modal, overlayConfig).result.then((modal) => {
    //   if(!modal) {
    //     return {dismiss: false};
    //   }
    //   return modal;
    // }, () => {
    //   return new Promise((resolve) =>resolve({dismiss: true}));
    // });

    return new Promise<any>((resolve, reject) => {
      resolve();
    });
  }

  async openBlock(data: BlockModalData): Promise<DialogResponse<any>> {
    return this.open<BlockModalData, any, BlockModalComponent>(
      "BLOCK",
      BlockModalComponent,
      data
    );
  }

  async openAddToken(): Promise<DialogResponse<any>> {
    return this.openViewOnly("HOME.ADD_TOKEN", AddTokenComponent);
  }

  async openTransaction(
    data: TransactionModalData
  ): Promise<DialogResponse<any>> {
    return this.open<TransactionModalData, any, TransactionModalComponent>(
      "TRANSACTION_MODAL",
      TransactionModalComponent,
      data
    );
  }

  async openBackupDisclaimerModal(): Promise<DialogResponse<any>> {
    return this.openViewOnly(
      "ACCOUNT.BACKUP_DISCLAIMER.TITLE",
      BackupDisclamerComponent
    );
  }

  async openTransactionConfirm(
    data: TransactionSignData
  ): Promise<DialogResponse<TransactionSignResponse>> {
    return this.open<
      TransactionSignData,
      TransactionSignResponse,
      TransactionSignModalComponent
    >(
      "TRANSACTION.CONFIRM_TRANSACTION.TITLE",
      TransactionSignModalComponent,
      data
    );
  }

  openSwapCreate(data?: any): Promise<any> {
    return this.openModal(CreateSwapComponent, {
      isBlocking: false,
      dialogClass: "adaptive-dialog",
      param: data
    });
  }

  openSwapCreateConfirm(data?: any): Promise<any> {
    return this.openModal(CreateSwapConfirmComponent, {
      isBlocking: false,
      dialogClass: "adaptive-dialog",
      param: data
    });
  }

  openSwapLoadConfirm(data?: any): Promise<any> {
    return this.openModal(LoadSwapConfirmComponent, {
      isBlocking: false,
      dialogClass: "adaptive-dialog",
      param: data
    });
  }

  openBuyAensConfirm(data?: any): Promise<any> {
    return this.openModal(NameBuyConfirmComponent, {
      isBlocking: false,
      dialogClass: "adaptive-dialog",
      param: data
    });
  }

  openSetAensAddressConfirm(data?: any): Promise<any> {
    return this.openModal(NameUpdateAddressConfirmComponent, {
      isBlocking: false,
      dialogClass: "adaptive-dialog",
      param: data
    });
  }

  openTransferAensNameConfirm(data?: any): Promise<any> {
    return this.openModal(NameTransferConfirmComponent, {
      isBlocking: false,
      dialogClass: "adaptive-dialog",
      param: data
    });
  }

  openReleaseAensNameConfirm(data?: any): Promise<any> {
    return this.openModal(NameReleaseConfirmComponent, {
      isBlocking: false,
      dialogClass: "adaptive-dialog",
      param: data
    });
  }
}
