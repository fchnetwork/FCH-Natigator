import { Component, OnInit } from '@angular/core';
import { iTransactionSettings, iSettings } from '@shared/app.interfaces';
import { SettingsService } from '@app/core/settings/settings.service';
import { TransactionService } from '@app/core/transactions/transaction-service/transaction.service';


@Component({
  selector: 'app-settings-transactions',
  templateUrl: './settings-transactions.component.html',
  styleUrls: ['./settings-transactions.component.scss']
})
export class SettingsTransactionsComponent implements OnInit {
  web3: any;

  transactionSettings: iTransactionSettings = {
    gasPrice: "",
    maxTransactionGas: "",
    lastTransactionsNumber: ""
  };

  constructor( private settingsService: SettingsService,
              _txnSrv: TransactionService ) 
  {
    this.web3 = _txnSrv.web3;
  }

  ngOnInit() {
    this.getTransactionSettings();
  }

  saveSettings() {
    const transactionSettings: iTransactionSettings = {
      gasPrice: this.web3.utils.toWei(this.transactionSettings.gasPrice, 'gwei'),
      maxTransactionGas: this.transactionSettings.maxTransactionGas,
      lastTransactionsNumber: this.transactionSettings.lastTransactionsNumber
    };
    this.settingsService.saveSettings("transactionSettings", transactionSettings);
  }

  getTransactionSettings() {
    let settings: iSettings = this.settingsService.getSettings();
    this.transactionSettings.gasPrice = this.web3.utils.fromWei( settings.transactionSettings.gasPrice, 'gwei');
    this.transactionSettings.lastTransactionsNumber = settings.transactionSettings.lastTransactionsNumber;
    this.transactionSettings.maxTransactionGas = settings.transactionSettings.maxTransactionGas;
  }

}
