import { Injectable } from '@angular/core';
import { Overlay } from 'ngx-modialog'; 
import { Modal, DialogRef, overlayConfigFactory, OverlayConfig, ModalComponent, ContainerContent } from "ngx-modialog";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";  
import { CreateSwapConfirmComponent } from '@app/wallet/swap/components/create-swap/create-swap-confirm/create-swap-confirm.component';
import { LoadSwapConfirmComponent } from '@app/wallet/swap/components/load-swap/load-swap-confirm/load-swap-confirm.component';
import { AerunNameBuyConfirmComponent } from '@app/wallet/aens/components/aerun-name-buy-confirm/aerun-name-buy-confirm.component';
import { BackupDisclamerComponent } from '@app/account/backup-disclamer/backup-disclamer.component';
import { TransactionModalComponent } from '@app/shared/modals/transaction-modal/transaction-modal.component';
import { TransactionSignModalComponent } from '@app/shared/modals/transaction-sign-modal/transaction-sign-modal.component';
import { AddTokenComponent } from '@app/wallet/home/components/add-token/add-token.component';
import { BlockModalComponent } from '@app/shared/modals/block-modal/block-modal.component';
import { GetBlockModalComponent } from '@app/shared/modals/get-block-modal/get-block-modal.component';

@Injectable()
export class ModalService {
   
  constructor(private modal: Modal) {
  }

  public openModal(modal: ContainerContent, config: any = {}): Promise<DialogRef<any>> {
    let currentConfig = {
      isBlocking: false,
      dialogClass: 'adaptive-dialog'
    }

    Object.assign(currentConfig, config);

    const overlayConfig = overlayConfigFactory(currentConfig, BSModalContext);
    return this.modal.open(modal, overlayConfig).result.then((modal) => {
      if(!modal) {
        return {dismiss: false};
      }
      return modal;
    }, () => {
      return new Promise((resolve, reject) =>resolve({dismiss: true}));
    });
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

  openSwapLoadConfirm(data?: any): Promise<any> {
    return this.openModal(LoadSwapConfirmComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }

  openBuyAensConfirm(data?: any): Promise<any> {
    return this.openModal(AerunNameBuyConfirmComponent, { isBlocking: false, dialogClass: 'adaptive-dialog', param: data });
  }
}