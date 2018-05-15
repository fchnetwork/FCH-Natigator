import { Component, OnInit, Inject, forwardRef, Output, EventEmitter } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { iTransaction } from '@shared/app.interfaces';
import * as Moment from 'moment'; 
import { environment } from '@env/environment'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

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
  setBtnTxt$ = new BehaviorSubject("Convert to UTF-8"); 
  btnText: string;
  
    constructor(
    public dialog: DialogRef<TransactionModalContext>) {
      if(dialog.context.hash) {
        this.hash = dialog.context.hash;
      }
      if(dialog.context.transaction) {
        this.transaction = dialog.context.transaction;
        this.transaction.data = dialog.context.transaction.data;
      }
      else {
        // GET TRANSACTION via HASH or id or define it
      }
      
      this.setBtnTxt$.subscribe((value) => {
        this.btnText = value;
      });
      
   }

  ngOnInit() {
  }

  openBlock(blockNumber) {
    window.open( environment.externalBlockExplorer + 'block/' + blockNumber, "_blank");
  }
  
  openTxn(txnHash){
    window.open( environment.externalBlockExplorer + 'transaction/' + txnHash, "_blank");
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
      window.location.href=`${this.dialog.context.urls.success}?hash=${this.hash}`;
    }
  }

  convert() {
    this.showHexData = !this.showHexData;
    if (this.showHexData) {
      this.toText.emit(null);
      this.setBtnTxt$.next("Convert to UTF-8");
    } else {
      this.toHex.emit(null);
      this.setBtnTxt$.next("Convert to Hex");
    }
  }

}
