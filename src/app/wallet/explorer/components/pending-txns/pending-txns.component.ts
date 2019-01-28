import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { ExplorerService } from '@core/explorer/explorer-service/explorer.service';
import { TransactionModalData } from '@app/wallet/explorer/components/transaction-modal/transaction-modal.component';
import { environment } from '@env/environment';
import { iPendingTxn } from '@app/shared/app.interfaces';

@Component({
  selector: 'app-pending-txns',
  templateUrl: './pending-txns.component.html'
})
export class PendingTxnsComponent implements OnInit {

  transactions: iPendingTxn[] = [];
  perfectScrollbarDisabled = environment.isMobileBuild;

  constructor( public exploreSrv: ExplorerService,
               private router: Router,
               private modal: ModalService) { }


  ngOnInit() {
    this.getPendingTxPool();
  }

  getPendingTxPool() {
    const pendingTxnKeys = [];
    this.exploreSrv.getPendingTransactions().then( res => {
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

  async openTransaction(transaction) {
    const data: TransactionModalData = {
      hash: transaction.hash,
      transaction: transaction,
      external: false,
      orderId: null,
      urls: null
    };

    await this.modal.openTransaction(data);
  }
}
