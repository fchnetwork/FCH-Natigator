import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { TransactionServiceService } from '@app/transaction/services/transaction-service/transaction-service.service';

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
    private transactionService: TransactionServiceService,
  ) { 
    setInterval(()=>{
      this.transactions = this.sessionStorage.retrieve('transactions');
    },3000);
    setTimeout(()=>{
      this.transactionService.updateTransactionsStatuses(this.transactions);
    }, 4000);
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

  checkTransactionsStatus(transactions){
    this.transactions = [];
    for(let i = 0; i < transactions.length; i++) {
      this.transactionService.getTransactionsDetails(transactions[i].hash).then((res)=>{
        if(status) {
          transactions[i].data = 'Success';
          this.transactions.push(transactions[i]);
        }
      }).catch((err) => {
        this.transactions.push()
      });
    }
  }
  
  ngOnInit() {}

}