import { Component, OnInit, ChangeDetectorRef, NgZone  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'; 
import { ExplorerService } from '../../services/explorer.service';
import { iBlocks, iTransaction } from '../../../shared/app.interfaces';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-pending-txns',
  templateUrl: './pending-txns.component.html'
})
export class PendingTxnsComponent implements OnInit {

  transactions: iTransaction[];
  
  constructor(
               private _ngZone: NgZone,
               public exploreSrv: ExplorerService,
               private cd: ChangeDetectorRef,
               private router: Router,
               private modal: ModalService
  ) { }

  ngOnInit() {
    this.transactions = [];

    const demoTransaction: iTransaction = {
      "blockHash": '0x7aaBfCB2d414f884a48b88015b9021080E3760A9',
      "blockNumber": 5260128,
      "from": '0x1234fCB2d414f884a48b88015b9021080E3760A9',
      "gas": 28,
      "gasPrice": '0.000861',
      "hash": '0x9876fCB2d414f884a48b88015b9021080E3760A9',
      "input": '...',
      "nonce": 3,
      "to": '0x7543fCB2d414f884a48b88015b9021080E3760A9',
      "transactionIndex": 123456,
      "value": '0.001138',
      "v": '...',
      "r": '...',
      "s": '...'
    };
    
    for(let i=0; i<7; i++) {
      this.transactions.push(demoTransaction);
    }
    
  }

  openTransaction(transaction) {
    this.modal.openTransaction(transaction.hash).then((result) => {
    }).catch( () => {});
  }

  getTransactionsCount() {
    return this.transactions.length;
  }

}
