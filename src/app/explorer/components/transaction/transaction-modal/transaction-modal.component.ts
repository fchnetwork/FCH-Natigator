import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { iTransaction } from '@shared/app.interfaces';
import * as Moment from 'moment';
import { ModalService } from '@shared/services/modal.service';
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

    constructor(
    @Inject( forwardRef( () => ModalService ) ) private modal: ModalService, // IMPORTANT - you cant add a modal within a modal so have to inject the dependency using forwardRef
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
    this.modal.openAndGetBlock(blockNumber).then( result =>{ 
     })
     .catch( () => {});
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
}
