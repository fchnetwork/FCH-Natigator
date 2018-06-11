import { SessionStorageService } from 'ngx-webstorage';
import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class SettingsBackupService {

  constructor(
    private sessionStorageService: SessionStorageService
  ) { }

  generateFile(data, fileName) {
    const stringifiedData = JSON.stringify(data);
    const blob = new Blob([stringifiedData], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const link: any = document.createElement('A');
    link.download = `${fileName}.json`;
    link.href = url;

    document.body.appendChild(link);
    link.click();
  }
  simpleBackup() {
    const data = this.sessionStorageService.retrieve('seed');
    const preparedData = {
      seed: data
    };
    this.generateFile(preparedData, 'seed_backup');
  }
  fullBackup() {
    const aerumBase = Cookie.get('aerum_base');
    const aerumKeyStore = Cookie.get('aerum_keyStore');
    const tokens = Cookie.get('tokens');
    const transactions = Cookie.get('transactions');
    const preparedData = {
      aerumBase,
      aerumKeyStore,
      tokens,
      transactions,
    };
    this.generateFile(preparedData, 'full_backup');
  }
}
