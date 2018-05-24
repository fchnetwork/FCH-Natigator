import { Component, OnInit, Inject, forwardRef, Output, EventEmitter } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { iTransaction } from '@shared/app.interfaces';
import * as Moment from 'moment'; 
import { environment } from '@env/environment'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { TransactionModalContext } from '@app/shared/modals/models/transaction-modal-context.model';
 
@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss']
})
export class TransactionModalComponent implements OnInit, ModalComponent<TransactionModalContext> {

  hash: string;
  orderId: string;
  transaction: iTransaction;
  transactionHex: string;
  showHexData: boolean = true;
  @Output() toText: EventEmitter<any> = new EventEmitter();
  @Output() toHex: EventEmitter<any> = new EventEmitter();
  setBtnTxt$ = new BehaviorSubject("Convert to UTF-8"); 
  btnText: string;
  
    constructor(
    public dialog: DialogRef<any>) {
      if(dialog.context.orderId) {
        this.orderId = dialog.context.orderId;
      }
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
      console.log(this.dialog.context);
      const query = {
        orderId: this.dialog.context.orderId,
        txHash: this.dialog.context.transaction.hash,
        from: this.dialog.context.transaction.from,
        to: this.dialog.context.transaction.to
      };
      window.location.href=`${this.dialog.context.urls.success}?query=${JSON.stringify(query)}`;
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
