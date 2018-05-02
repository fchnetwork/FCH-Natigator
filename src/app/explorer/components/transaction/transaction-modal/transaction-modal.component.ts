import { Component, OnInit, Inject, forwardRef, Output, EventEmitter } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { iTransaction } from '@shared/app.interfaces';
import * as Moment from 'moment';
import { ModalService } from '@shared/services/modal.service';
import { environment } from '@env/environment'
export interface TransactionModalContext {
  hash?: string;
  transaction?: iTransaction;
  external?: boolean;
  urls?: any;
}

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss']
})
export class TransactionModalComponent implements OnInit, ModalComponent<TransactionModalContext> {

  hash: string;
  transaction: iTransaction;
  transactionHex: string;
  showHexData: boolean = true;
  @Output() toText: EventEmitter<any> = new EventEmitter();
  @Output() toHex: EventEmitter<any> = new EventEmitter();

    constructor(
    public dialog: DialogRef<TransactionModalContext>) {
      if(dialog.context.hash) {
        this.hash = dialog.context.hash;
      }
      if(dialog.context.transaction) {
        this.transaction = dialog.context.transaction;
         //  this.transaction.timestamp = dialog.context.transaction.timestamp ? dialog.context.transaction.timestamp : Moment(new Date()).unix();
        // this.transaction.data = dialog.context.transaction.data ? String(dialog.context.transaction.data) : '0x0000002';
        this.transaction.data = dialog.context.transaction.data;
      }
      else {
        // GET TRANSACTION via HASH or id or define it
      }
   }

  ngOnInit() {
  }

  openBlock(blockNumber) {
    window.open( environment.externalBlockExplorer + 'block/' + blockNumber, "_blank");
     // http://explore.aerum.net/#/block/245490
    // to do  - setup external blockchain explorer and feed this block number into it in a new tab
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
      window.location.href=this.dialog.context.urls.success;
    }
  }

  convert() {
    this.showHexData = !this.showHexData;
    if (this.showHexData) {
      this.toText.emit(null);
    } else {
      this.toHex.emit(null);
    }
  }

}
