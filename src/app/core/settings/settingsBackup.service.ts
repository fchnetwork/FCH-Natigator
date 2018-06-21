import { SessionStorageService } from 'ngx-webstorage';
import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class SettingsBackupService {

  constructor(
    private sessionStorageService: SessionStorageService
  ) { }

  generateFile(data, fileName, type) {
    const stringifiedData = type === 'seed' ? data.seed : JSON.stringify(data);
    const blob = new Blob([stringifiedData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);

    const link: any = document.createElement('A');
    link.download = `${fileName}.txt`;
    link.href = url;

    document.body.appendChild(link);
    link.click();
  }
  simpleBackup() {
    const data = this.sessionStorageService.retrieve('seed');
    const preparedData = {
      seed: data
    };
    this.generateFile(preparedData, 'seed_backup', 'seed');
  }
  fullBackup() {
    const aerumBase = Cookie.get('aerum_base');
    const aerumKeyStore = Cookie.get('aerum_keyStore');
    const tokens = Cookie.get('tokens');
    const transactions = Cookie.get('transactions');
    const ethereumAccounts = Cookie.get('ethereum_accounts');
    const crossChainSwaps = Cookie.get('cross_chain_swaps');
    const preparedData = {
      aerumBase,
      aerumKeyStore,
      tokens,
      transactions,
      ethereumAccounts,
      crossChainSwaps
    };
    this.generateFile(preparedData, 'full_backup', 'full');
  }
}
