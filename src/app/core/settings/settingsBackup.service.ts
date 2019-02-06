import { Injectable } from '@angular/core';
import { StorageService } from "@core/general/storage-service/storage.service";
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { iFullBackup } from '@shared/app.interfaces';
import { environment } from '@env/environment';

declare const window: any;

@Injectable()
export class SettingsBackupService {
  private isMobileBuild = environment.isMobileBuild;

  constructor(private storageService: StorageService,
              private notificationMessagesService: NotificationMessagesService
  ) { }

  async generateFile(data, fileName, type) {
    const stringifiedData = type === 'seed' ? data.seed : JSON.stringify(data);
    const blob = new Blob([stringifiedData], {type: "text/plain"});

    if (this.isMobileBuild) {
      return await this.generateFileMobile(blob, `${fileName}.txt`);  
    }
    return this.generateFileWeb(blob, `${fileName}.txt`);
  }

  generateFileWeb(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link: any = document.createElement('A');
    link.download = fileName;
    link.href = url;

    document.body.appendChild(link);
    link.click();
  }

  generateFileMobile(blob, fileName) {
    const promise = new Promise<string>(
      (resolve, reject): void => {
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, fs => {
          let dirPath = 'Aerum';
          let filePath = dirPath + '/' + fileName;
          if(window.device.platform === 'iOS') {
            dirPath = '/';
            filePath = fileName;
          }
          fs.root.getDirectory(dirPath, { create: true, exclusive: false }, () => {
            fs.root.getFile(filePath, { create: true, exclusive: false }, async fileEntry => {
              await this.writeFile(fileEntry, blob);
              resolve();
            }, err => reject(err));
          }, err => reject(err));
        }, err => reject(err));
    });
    return promise;
  }

  writeFile(fileEntry, dataObj) {
    const promise = new Promise<string>(
      (resolve, reject): void => {
        fileEntry.createWriter(fileWriter => {
          fileWriter.onwriteend = () => resolve();
          fileWriter.onerror = err => reject(err);
          fileWriter.write(dataObj);
      });
    });
    return promise;
  }

  async simpleBackup() {
    const data = this.storageService.getSessionData('seed');
    const preparedData = {
      seed: data
    };
    await this.generateFile(preparedData, 'seed_backup', 'seed');
    this.notificationMessagesService.simpleBackup();
  }

  formatDate() {
    const date = new Date().toLocaleString().replace(/ /g, '').replace(",", "_").replace(/\//g,'-').replace(/:/g,'-');
    return date;
  }

  async fullBackup() {
    const aerumBase = this.storageService.getCookie('aerum_base');
    const aerumKeyStore = this.storageService.getCookie('aerum_keyStore');
    const tokens = this.storageService.getCookie('tokens');
    const ethereumTokens = this.storageService.getCookie('ethereum_tokens');
    const transactions = this.storageService.getCookie('transactions');
    const settings = this.storageService.getCookie('settings');
    const ethereumAccounts = this.storageService.getCookie('ethereum_accounts');
    const crossChainSwaps = this.storageService.getCookie('cross_chain_swaps');
    const stakings = this.storageService.getCookie('stakings');
    const preparedData: iFullBackup = {
      aerum_base: aerumBase,
      aerum_keyStore: aerumKeyStore,
      tokens: tokens,
      ethereum_tokens: ethereumTokens,
      transactions: transactions,
      settings: settings,
      ethereum_accounts: ethereumAccounts,
      cross_chain_swaps: crossChainSwaps,
      stakings: stakings
    };
    await this.generateFile(preparedData, 'full_backup' + this.formatDate(), 'full');
    this.notificationMessagesService.fullBackup();
  }
}
