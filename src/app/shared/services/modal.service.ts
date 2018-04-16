import { Injectable } from '@angular/core';
import { Overlay } from 'ngx-modialog';
import { BasicModalComponent } from '../components/modals/basic-modal/basic-modal.component';
import { Modal, DialogRef, overlayConfigFactory, OverlayConfig, ModalComponent, ContainerContent } from "ngx-modialog";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";
import { BackupDisclamerComponent } from '../../account/backup-disclamer/backup-disclamer.component';
import { TransactionSignModalComponent } from '../../transaction/components/transaction-sign-modal/transaction-sign-modal.component';
import { BlockModalComponent } from '../../explorer/components/block/block-modal/block-modal.component';
import { TransactionModalComponent } from '../../explorer/components/transaction/transaction-modal/transaction-modal.component';

@Injectable()
export class ModalService {

  constructor(private modal: Modal) {
  }

  private openModal(modal: ContainerContent, config: any = {}): Promise<DialogRef<any>> {
    let overlayConfig = overlayConfigFactory(config, BSModalContext);
    return this.modal.open(modal, overlayConfig).result.then((modal) => {
      if(!modal) {
        return {dismiss: false};
      }
      return modal;
    }, () => {
      return new Promise((resolve, reject) => {return resolve({dismiss: true})});
    });
  }

  public openBasicModal(data?: any): Promise<any> {
    return this.openModal(BasicModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  public openBackupDisclaimerModal(data?: any) {
    return this.openModal(BackupDisclamerComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  public openTransactionConfirm(data?: any): Promise<any> {
    return this.openModal(TransactionSignModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }
  
  public openBlock(blockNumber: any = null, block: any = null): Promise<any> {
    return this.openModal(BlockModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', blockNumber: blockNumber, block: block });
  }

  public openTransaction(hash: any = null, transaction: any = null): Promise<any> {
    return this.openModal(TransactionModalComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', hash: hash, transaction: transaction });
  }
}