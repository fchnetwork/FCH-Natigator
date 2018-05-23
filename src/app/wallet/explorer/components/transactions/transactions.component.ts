import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { iBlocks, iTransaction } from '@shared/app.interfaces';
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { ExplorerService } from '@app/core/explorer/explorer-service/explorer.service';
import { LoaderService } from '@app/core/general/loader-service/loader.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})

export class TransactionsComponent implements AfterViewInit {
  transactionsFound: number;
  transactions: iTransaction[] = [];
  column: string = 'timestamp';
  descending: boolean = false;
  transactionStatus: boolean = false;
  latestBlock: number;
  highBlock: number;
  lowBlock: number;
  maxBlocks: number = 100;

  constructor(public exploreSrv: ExplorerService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private loaderService: LoaderService) { }

  ngAfterViewInit() {
    // First get the latest block number
    this.exploreSrv.getLatestBlockNumber().then(latestBlockNumber => {
      this.highBlock = latestBlockNumber;
      this.latestBlock = latestBlockNumber;
      this.loadTransactions();
    });
  }

  loadTransactions() {
    this.loaderService.toggle(true);

    this.exploreSrv.getTransactions(this.highBlock, this.maxBlocks).then(transactionList => {
      this.loaderService.toggle(false);
      this.transactions = this.transactions.concat(transactionList.transactions);
      this.highBlock = transactionList.highBlock - 1; 
    });
  }

  openBlock(transaction) {
    this.modal.openBlock(transaction.blockNumber, transaction.block).then(result => {
    }).catch(() => { });
  }

  openTransaction(transaction) {
    this.modal.openTransaction(transaction.hash, transaction, false, null).then((result) => {
    }).catch(() => { });
  }
}
