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
          Object.keys(res[element]).forEach( (key,index) => {
            this.transactions.push({
              blockHash:  res[element][key].blockHash,
              from:  res[element][key].from,
              to:  res[element][key].to,
              gas:  res[element][key].gas,
              gasPrice:  res[element][key].gasPrice,
              hash:  res[element][key].hash,
              nonce:  res[element][key].nonce,
              transactionIndex:  res[element][key].transactionIndex,
              value:  res[element][key].value
            })
        });
      });
    });
  }





  openTransaction(transaction) {
    this.modal.openTransaction(transaction.hash, transaction, false, null).then((result) => {
    }).catch( () => {});
  }


}
