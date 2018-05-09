import { Injectable } from '@angular/core';
import { Overlay } from 'ngx-modialog';
import { BasicModalComponent } from '../components/modals/basic-modal/basic-modal.component';
import { Modal, DialogRef, overlayConfigFactory, OverlayConfig, ModalComponent, ContainerContent } from "ngx-modialog";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";
import { BackupDisclamerComponent } from '../../account/backup-disclamer/backup-disclamer.component'; 
import { TransactionSignModalComponent } from '@app/wallet/transaction/components/transaction-sign-modal/transaction-sign-modal.component';
import { AddTokenComponent } from '@app/wallet/dashboard/components/add-token/add-token.component';
import { BlockModalComponent } from '@app/wallet/explorer/components/block/block-modal/block-modal.component';
import { GetBlockModalComponent } from '@app/wallet/explorer/components/block/get-block-modal/get-block-modal.component';
import { TransactionModalComponent } from '@app/wallet/explorer/components/transaction/transaction-modal/transaction-modal.component';
import { CreateSwapConfirmComponent } from '@app/wallet/swap/components/create-swap/create-swap-confirm/create-swap-confirm.component';
import { LoadSwapConfirmComponent } from '@app/wallet/swap/components/load-swap/load-swap-confirm/load-swap-confirm.component';

@Injectable()
export class ModalService {

  constructor(private modal: Modal) {
  }

  private openModal(modal: ContainerContent, config: any = {}): Promise<DialogRef<any>> {
    const overlayConfig = overlayConfigFactory(config, BSModalContext);
    return this.modal.open(modal, overlayConfig).result.then((modal) => {
      if(!modal) {
        return {dismiss: false};
      }
      return modal;
    }, () => {
      return new Promise((resolve, reject) =>resolve({dismiss: true}));
    });
  }

  openBasicModal(data?: any): Promise<any> {
    return this.openModal(BasicModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
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

  openAndGetBlock(blockNumber: any = null): Promise<any> {
    return this.openModal(GetBlockModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', blockNumber  });
  }
  
  openTransaction(hash: any = null, transaction: any, external, urls): Promise<any> {
    return this.openModal(TransactionModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', hash, transaction, external, urls });
  }
  
  openSwapCreateConfirm(data?: any): Promise<any> {
    return this.openModal(CreateSwapConfirmComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  openLoadCreateConfirm(data?: any): Promise<any> {
    return this.openModal(LoadSwapConfirmComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }
}