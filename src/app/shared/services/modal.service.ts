import { Injectable } from '@angular/core';
import { Overlay } from 'ngx-modialog';
import { BasicModalComponent } from '../components/modals/basic-modal/basic-modal.component';
import { Modal, DialogRef, overlayConfigFactory, OverlayConfig, ModalComponent, ContainerContent } from "ngx-modialog";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";
import { BackupDisclamerComponent } from '../../account/backup-disclamer/backup-disclamer.component';
import { TransactionSignModalComponent } from '../../transaction/components/transaction-sign-modal/transaction-sign-modal.component';
import { BlockModalComponent } from '../../explorer/components/block/block-modal/block-modal.component';
import { TransactionModalComponent } from '../../explorer/components/transaction/transaction-modal/transaction-modal.component';
import { AddTokenComponent } from '@app/dashboard/components/add-token/add-token.component';

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

  openTransactionConfirm(data?: any): Promise<any> {
    return this.openModal(TransactionSignModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  openAddToken(data?: any): Promise<any> {
    return this.openModal(AddTokenComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }
  
  openBlock(blockNumber: any = null, block: any = null): Promise<any> {
    return this.openModal(BlockModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', blockNumber, block });
  }

  openTransaction(hash: any = null, transaction: any = null): Promise<any> {
    return this.openModal(TransactionModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', hash, transaction });
  }
}