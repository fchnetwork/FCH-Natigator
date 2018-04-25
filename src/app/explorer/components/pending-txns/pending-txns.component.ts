import { element } from 'protractor';
import { Component, OnInit, ChangeDetectorRef, NgZone  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'; 
import { ExplorerService } from '../../services/explorer.service';
import { iBlocks, iPendingTxn } from '../../../shared/app.interfaces';
import { ModalService } from '../../../shared/services/modal.service';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-pending-txns',
  templateUrl: './pending-txns.component.html'
})
export class PendingTxnsComponent implements OnInit {

  transactions: Array<iPendingTxn> = [];
  constructor(
               private _ngZone: NgZone,
               public exploreSrv: ExplorerService,
               private cd: ChangeDetectorRef,
               private router: Router,
               private modal: ModalService
  ) { }

  ngOnInit() {
    this.getPendingTxPool();   
  }



getPendingTxPool() {
  const pendingTxnKeys = [];
  this.exploreSrv.getPendingTransactions().subscribe( res => {
    Object.keys(res).forEach( (key,index) => {
      pendingTxnKeys.push(key)
    });
    pendingTxnKeys.forEach( element => {
      for (let index = 0; index < Object.keys(res[element]).length; index++) {
       const txn = res[element][index];
       this.transactions.push({ blockHash: txn.blockHash, from: txn.from, to: txn.to, gas: txn.gas, gasPrice: txn.gasPrice, hash: txn.hash, nonce: txn.nonce, transactionIndex: txn.transactionIndex, value: txn.value })
      }
    });
});
}





  openTransaction(transaction) {
    this.modal.openTransaction(transaction.hash).then((result) => {
    }).catch( () => {});
  }


}
