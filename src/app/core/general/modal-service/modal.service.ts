import { Injectable } from '@angular/core';
import { Modal, DialogRef, overlayConfigFactory, ContainerContent } from "ngx-modialog";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap"; 
import { AddTokenComponent } from '@app/wallet/home/components/add-token/add-token.component';  
import { CreateSwapConfirmComponent } from '@app/wallet/swap/components/create-swap/create-swap-confirm/create-swap-confirm.component';
import { LoadSwapConfirmComponent } from '@app/wallet/swap/components/load-swap/load-swap-confirm/load-swap-confirm.component';
import { BackupDisclamerComponent } from '@app/account/backup-disclamer/backup-disclamer.component';
import { NameBuyConfirmComponent } from '@app/wallet/aens/components/name-buy-confirm/name-buy-confirm.component';
import { NameUpdateAddressConfirmComponent } from '@app/wallet/aens/components/name-update-address-confirm/name-update-address-confirm.component';
import { NameTransferConfirmComponent } from "@aens/components/name-transfer-confirm/name-transfer-confirm.component";
import { NameReleaseConfirmComponent } from "@aens/components/name-release-confirm/name-release-confirm.component";
import { BlockModalComponent } from '@app/shared/modals/block-modal/block-modal.component';
import { TransactionModalComponent } from '@app/shared/modals/transaction-modal/transaction-modal.component';
import { TransactionSignModalComponent } from '@app/shared/modals/transaction-sign-modal/transaction-sign-modal.component';

@Injectable()
export class ModalService {

  constructor(private modal: Modal) {
  }

  openModal(modal: ContainerContent, config: any = {}): Promise<DialogRef<any>> {
    const overlayConfig = overlayConfigFactory(config, BSModalContext);
    return this.modal.open(modal, overlayConfig).result.then((modal) => {
      if(!modal) {
        return {dismiss: false};
      }
      return modal;
    }, () => {
      return new Promise((resolve) =>resolve({dismiss: true}));
    });
  }

  openBackupDisclaimerModal(data?: any) {
    return this.openModal(BackupDisclamerComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  openTransactionConfirm(data?: any, external?: boolean): Promise<any> {
    return this.openModal(TransactionSignModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data, external });
  }

  openAddToken(data?: any): Promise<any> {
    return this.openModal(AddTokenComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  openBlock(blockNumber: any = null, block: any = null): Promise<any> {
    return this.openModal(BlockModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', blockNumber, block });
  }

  openTransaction(hash: any = null, transaction: any, external, urls): Promise<any> {
    return this.openModal(TransactionModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', hash, transaction, external, urls });
  }

  openSwapCreateConfirm(data?: any): Promise<any> {
    return this.openModal(CreateSwapConfirmComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  openSwapLoadConfirm(data?: any): Promise<any> {
    return this.openModal(LoadSwapConfirmComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  openBuyAensConfirm(data?: any): Promise<any> {
    return this.openModal(NameBuyConfirmComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  openSetAensAddressConfirm(data?: any): Promise<any> {
    return this.openModal(NameUpdateAddressConfirmComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  openTransferAensNameConfirm(data?: any): Promise<any> {
    return this.openModal(NameTransferConfirmComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  openReleaseAensNameConfirm(data?: any): Promise<any> {
    return this.openModal(NameReleaseConfirmComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }
}
