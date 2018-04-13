import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { iTransaction } from '../../../../shared/app.interfaces';

export interface TransactionModalContext {
  hash?: string;
  transaction?: iTransaction;
}

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html'
})
export class TransactionModalComponent implements OnInit, ModalComponent<TransactionModalContext> {

  hash: string;
  transaction: iTransaction;

  constructor(public dialog: DialogRef<TransactionModalContext>) {
    if(dialog.context.hash) {
      this.hash = dialog.context.hash;
    }
    if(dialog.context.transaction) {
      this.transaction = dialog.context.transaction;
    }
    else {
      // GET TRANSACTION via HASH or id or define it
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
