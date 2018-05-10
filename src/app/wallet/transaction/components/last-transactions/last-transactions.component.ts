import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { TransactionService } from '@app/core/transaction-service/transaction-service.service';

@Component({
  selector: 'app-last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrls: ['./last-transactions.component.scss']
})
export class LastTransactionsComponent implements OnInit {
  transactions = [];
  limit = 3;
  showedAll = false;
  constructor(
    private sessionStorage: SessionStorageService,
    private transactionService: TransactionService,
  ) {
    setInterval(() => {
      this.transactions = this.sessionStorage.retrieve('transactions').sort((b, a) => {
        const c: any = new Date(a.date);
        const d: any = new Date(b.date);
        return c - d;
      });
    }, 3000);
    setInterval(() => {
      for (let i = 0; i < this.transactions.length; i++) {
        if (this.transactions[i].data === 'Pending transaction' || this.transactions[i].data === 'Contract execution(pending)') {
          this.transactionService.updateTransactionsStatuses(this.transactions);
        }
      }
    }, 5000);
  }

  getICoin(amount) {
    return amount > 0;
  }

  showTransactions() {
    this.limit = 1000;
    this.showedAll = true;
  }
  hideTransactions() {
    this.limit = 3;
    this.showedAll = false;
  }

  ngOnInit() { }

}