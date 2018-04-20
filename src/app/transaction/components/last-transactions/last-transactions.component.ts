import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrls: ['./last-transactions.component.scss']
})
export class LastTransactionsComponent implements OnInit {
  transactions: [{}];
  limit = 3;
  constructor(
    private sessionStorage: SessionStorageService,
  ) { 
    setInterval(()=>{
      this.transactions = this.sessionStorage.retrieve('transactions');
    },3000);
  }

  getICoin(amount) {
    return amount > 0;
  }

  showTransactions() {
    this.limit = 1000;
  }
  
  ngOnInit() {}

}