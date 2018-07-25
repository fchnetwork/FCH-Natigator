import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { iTransaction } from '@shared/app.interfaces';
import { environment } from '@env/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { ModalViewComponent, DialogRef } from '@aerum/ui';

export class TransactionModalData {
  hash?: string;
  transaction?: iTransaction;
  external?: boolean;
  urls?: any;
  orderId: string;
}


@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss']
})
export class TransactionModalComponent implements OnInit, ModalViewComponent<TransactionModalData, any> {

  hash: string;
  orderId: string;
  transaction: iTransaction;
  showHexData = true;
  @Output() toText: EventEmitter<any> = new EventEmitter();
  @Output() toHex: EventEmitter<any> = new EventEmitter();
  setBtnTxt$ = new BehaviorSubject("Convert to UTF-8");
  btnText: string;

    constructor(public dialogRef: DialogRef<TransactionModalData, any>,
                public clipboardService: ClipboardService,
                public notificationService: InternalNotificationService) {
      this.setBtnTxt$.subscribe((value) => {
        this.btnText = value;
      });
   }

  ngOnInit() {
    this.transaction = this.dialogRef.data.transaction;
   }

  openBlock(blockNumber) {
    window.open( environment.externalBlockExplorer + 'block/' + blockNumber, "_blank");
  }

  openTxn(txnHash){
    window.open( environment.externalBlockExplorer + 'transaction/' + txnHash, "_blank");
  }

  redirectExternal(){
    if(this.dialogRef.data.external) {
      const query = {
        orderId: this.dialogRef.data.orderId,
        txHash: this.dialogRef.data.transaction.hash,
        from: this.dialogRef.data.transaction.from,
        to: this.dialogRef.data.transaction.to
      };
      window.location.href=`${this.dialogRef.data.urls.success}?query=${JSON.stringify(query)}`;
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

  copyToClipboard(hash) {
    if (hash) {
      this.clipboardService.copy(hash);
      this.notificationService.showMessage('Copied to clipboard!', 'Done');
    }
  }

}
