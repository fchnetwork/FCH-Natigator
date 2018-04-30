import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { iTransaction } from '../../../../shared/app.interfaces';
import * as Moment from 'moment';

export interface TransactionModalContext {
  hash?: string;
  transaction?: iTransaction;
  external?: boolean;
  redirectUrl?: string;
}

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss']
})
export class TransactionModalComponent implements OnInit, ModalComponent<TransactionModalContext> {

  hash: string;
  transaction: iTransaction;

  constructor(
    public dialog: DialogRef<TransactionModalContext>,
  ) {
    if(dialog.context.hash) {
      this.hash = dialog.context.hash;
    }
    if(dialog.context.transaction) {
      this.transaction = dialog.context.transaction;
      this.transaction.timestamp = dialog.context.transaction.timestamp ? dialog.context.transaction.timestamp : Moment(new Date()).unix();
      this.transaction.data = dialog.context.transaction.data ? String(dialog.context.transaction.data) : '0x0000002';
    }
    else {
      // GET TRANSACTION via HASH or id or define it
    }
   }

  ngOnInit() {
  }

  dismiss(): void {
    this.dialog.dismiss();
    this.redirectExternal();
  }

  close(): void {
    this.dialog.close();
    this.redirectExternal();
  }

  redirectExternal(){
    if(this.dialog.context.external) {
      window.location.href=this.dialog.context.redirectUrl;
    }
  }
}
