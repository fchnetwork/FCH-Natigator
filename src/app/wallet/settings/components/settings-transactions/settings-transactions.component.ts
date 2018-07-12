import { Component, OnInit } from '@angular/core';
import { iTransactionSettings, iSettings } from '@shared/app.interfaces';
import { SettingsService } from '@app/core/settings/settings.service';
import { TransactionService } from '@app/core/transactions/transaction-service/transaction.service';
import { ValidateService } from '@app/core/validation/validate.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


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

  settingsForm: FormGroup = this.formBuilder.group({});

  constructor( private settingsService: SettingsService,
              _txnSrv: TransactionService,
              private validateService: ValidateService,
              private formBuilder: FormBuilder ) 
  {
    this.web3 = _txnSrv.web3;
  }

  ngOnInit() {
    this.getTransactionSettings();
    const regexGasPrice = "(^[0][.]{1}[0-9]{0,}[1-9]+[0-9]{0,}$)|(^[1-9]+[0-9]{0,}[.]?[0-9]{0,}$)";
    const regexMaxGas = "^[1-9][0-9]*$";
    const regexLastTransactions = "^(?:[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$";

    this.settingsForm = this.formBuilder.group({
      "Default Gas Price": [null, [Validators.required, Validators.pattern(regexGasPrice)]],
      "Max Gas": [null, [Validators.required, Validators.pattern(regexMaxGas)]],
      "Last Transactions": [null, [Validators.required, Validators.pattern(regexLastTransactions)]]
    });
  }

  saveSettings() {
    const valid = this.validateService.validateForm(this.settingsForm, 'All fields are valid');
    if (valid) {
      const transactionSettings: iTransactionSettings = {
        gasPrice: this.web3.utils.toWei(this.transactionSettings.gasPrice, 'gwei'),
        maxTransactionGas: this.transactionSettings.maxTransactionGas,
        lastTransactionsNumber: this.transactionSettings.lastTransactionsNumber
      };
      this.settingsService.saveSettings("transactionSettings", transactionSettings);
    }
  }

  getTransactionSettings() {
    let settings: iSettings = this.settingsService.getSettings();
    this.transactionSettings.gasPrice = this.web3.utils.fromWei( settings.transactionSettings.gasPrice, 'gwei');
    this.transactionSettings.lastTransactionsNumber = settings.transactionSettings.lastTransactionsNumber;
    this.transactionSettings.maxTransactionGas = settings.transactionSettings.maxTransactionGas;
  }

}
