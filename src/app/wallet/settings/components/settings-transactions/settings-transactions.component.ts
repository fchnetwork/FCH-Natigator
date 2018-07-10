import { Component, OnInit } from '@angular/core';
import { iTransactionSettings, iSettings } from '@shared/app.interfaces';
import { SettingsService } from '@app/core/settings/settings.service';


@Component({
  selector: 'app-settings-transactions',
  templateUrl: './settings-transactions.component.html',
  styleUrls: ['./settings-transactions.component.scss']
})
export class SettingsTransactionsComponent implements OnInit {

  transactionSettings: iTransactionSettings = {
    gasPrice: "",
    maxTransactionGas: "",
    lastTransactionsNumber: ""
  };

  constructor( private settingsService: SettingsService ) {}

  ngOnInit() {
    this.getTransactionSettings();
  }

  saveSettings() {
    const transactionSettings: iTransactionSettings = {
      gasPrice: this.transactionSettings.gasPrice,
      maxTransactionGas: this.transactionSettings.maxTransactionGas,
      lastTransactionsNumber: this.transactionSettings.lastTransactionsNumber
    };
    this.settingsService.saveSettings("transactionSettings", transactionSettings);
  }

  getTransactionSettings() {
    let settings: iSettings = this.settingsService.getSettings();
    this.transactionSettings.gasPrice = settings.transactionSettings.gasPrice;
    this.transactionSettings.lastTransactionsNumber = settings.transactionSettings.lastTransactionsNumber;
    this.transactionSettings.maxTransactionGas = settings.transactionSettings.maxTransactionGas;
  }

}
