import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { iTransaction } from '../../../../shared/app.interfaces';
import { TransactionServiceService } from '@app/transaction/services/transaction-service/transaction-service.service';

export interface TransactionModalContext {
  hash?: string;
}

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
})
export class TransactionModalComponent implements OnInit, ModalComponent<TransactionModalContext> {

  hash: string;
  transaction: iTransaction;

  constructor(
    // public transactionService: TransactionServiceService,
    public dialog: DialogRef<TransactionModalContext>,
  ) {
    if(dialog.context.hash) {
      this.hash = dialog.context.hash;
      console.log(dialog.context.hash);
    }
   }

  ngOnInit() {
  }

  dismiss(): void {
    this.dialog.dismiss();
  }

  close(): void {
    this.dialog.close();
  }
}
