import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrls: ['./last-transactions.component.scss']
})
export class LastTransactionsComponent implements OnInit {
  transactions: [{}];
  limit = 3;
  constructor() { 
    setInterval(()=>{
      this.transactions = JSON.parse(Cookie.get('transactions'));
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