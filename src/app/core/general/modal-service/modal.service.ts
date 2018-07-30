import { NameReleaseConfirmRequest } from "./../../../wallet/aens/models/nameReleaseConfirmRequest";
import { TranslateService } from "@ngx-translate/core";
import { Injectable, Type } from "@angular/core";
import { AddTokenComponent } from "@app/wallet/home/components/add-token/add-token.component";
import { CreateSwapConfirmComponent } from "@app/wallet/swap/components/create-swap/create-swap-confirm/create-swap-confirm.component";
import { LoadSwapConfirmComponent, LoadSwapConfirmResponse } from "@app/wallet/swap/components/load-swap/load-swap-confirm/load-swap-confirm.component";
import { BackupDisclamerComponent } from "@app/account/backup-disclamer/backup-disclamer.component";
import { NameBuyConfirmComponent } from "@app/wallet/aens/components/name-buy-confirm/name-buy-confirm.component";
import { NameUpdateAddressConfirmComponent } from "@app/wallet/aens/components/name-update-address-confirm/name-update-address-confirm.component";
import { NameTransferConfirmComponent } from "@aens/components/name-transfer-confirm/name-transfer-confirm.component";
import { NameReleaseConfirmComponent } from "@aens/components/name-release-confirm/name-release-confirm.component";
import {
  TransactionSignModalComponent,
  TransactionSignData,
  TransactionSignResponse
} from "@app/wallet/transaction/components/transaction-sign-modal/transaction-sign-modal.component";
import { ModalService as UiModalService, DialogResponse } from "@aerum/ui";
import { ModalViewComponent } from "@aerum/ui";
import {
  CreateSwapComponent,
  CreateSwapModalContext
} from "@app/wallet/swap/components/create-swap/create-swap.component";
import { NameBuyConfirmRequest } from "@app/wallet/aens/models/nameBuyConfirmRequest";
import { NameTransferConfirmRequest } from "@app/wallet/aens/models/nameTransferConfirmRequest";
import { SetAddressConfirmRequest } from "@app/wallet/aens/models/setAddressConfirmRequest";
import {
  BlockModalData,
  BlockModalComponent
} from "@app/wallet/explorer/components/block-modal/block-modal.component";
import {
  TransactionModalData,
  TransactionModalComponent
} from "@app/wallet/explorer/components/transaction-modal/transaction-modal.component";
import { LoadedSwap } from "@app/wallet/swap/models/models";

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

  async openBuyAensConfirm(
    data: NameBuyConfirmRequest
  ): Promise<DialogResponse<any>> {
    return this.open<NameBuyConfirmRequest, any, NameBuyConfirmComponent>(
      "ENS.CONFIRM_BUY_TITLE",
      NameBuyConfirmComponent,
      data
    );
  }

  async openReleaseAensNameConfirm(
    data: NameReleaseConfirmRequest
  ): Promise<DialogResponse<any>> {
    return this.open<
      NameReleaseConfirmRequest,
      any,
      NameReleaseConfirmComponent
    >("ENS.CONFIRM_RELEASE_NAME_TITLE", NameReleaseConfirmComponent, data);
  }

  async openTransferAensNameConfirm(
    data: NameTransferConfirmRequest
  ): Promise<DialogResponse<any>> {
    return this.open<
      NameTransferConfirmRequest,
      any,
      NameTransferConfirmComponent
    >("ENS.CONFIRM_TRANSFER_NAME_TITLE", NameTransferConfirmComponent, data);
  }

  async openSetAensAddressConfirm(
    data: SetAddressConfirmRequest
  ): Promise<DialogResponse<any>> {
    return this.open<
      SetAddressConfirmRequest,
      any,
      NameUpdateAddressConfirmComponent
    >("ENS.CONFIRM_SET_ADDRESS_TITLE", NameUpdateAddressConfirmComponent, data);
  }

  async openSwapCreate(): Promise<DialogResponse<CreateSwapModalContext>> {
    return this.open<any, CreateSwapModalContext, CreateSwapComponent>(
      "SWAP.CREATE.TITLE",
      CreateSwapComponent,
      null
    );
  }

  async openSwapCreateConfirm(
    data: CreateSwapModalContext
  ): Promise<DialogResponse<any>> {
    return this.open<CreateSwapModalContext, any, CreateSwapConfirmComponent>(
      "SWAP.CREATE.TITLE",
      CreateSwapConfirmComponent,
      data
    );
  }

  async openSwapLoadConfirm(data: LoadedSwap): Promise<DialogResponse<LoadSwapConfirmResponse>> {
    return this.open<LoadedSwap, LoadSwapConfirmResponse, LoadSwapConfirmComponent>('SWAP.LOAD.CONFIRM_TITLE', LoadSwapConfirmComponent, data);
  }
}
