import { Injectable } from '@angular/core';
import { StorageService } from "@core/general/storage-service/storage.service";
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { iFullBackup } from '@shared/app.interfaces';
import { EnvironmentService } from "@core/general/environment-service/environment.service";

declare const window: any;

@Injectable()
export class SettingsBackupService {
  private isMobileBuild: boolean;

  constructor(private storageService: StorageService,
              private notificationMessagesService: NotificationMessagesService,
              private clipboardService: ClipboardService,
              private environment: EnvironmentService
  ) {
    this.isMobileBuild = this.environment.get().isMobileBuild;
  }

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
          let dirPath = 'FCH';
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
    const aerumBase = this.storageService.getStorage('aerum_base');
    const aerumKeyStore = this.storageService.getStorage('aerum_keyStore');
    const tokens = this.storageService.getStorage('tokens');
    const ethereumTokens = this.storageService.getStorage('ethereum_tokens');
    const transactions = this.storageService.getStorage('transactions');
    const settings = this.storageService.getStorage('settings');
    const ethereumAccounts = this.storageService.getStorage('ethereum_accounts');
    const crossChainSwaps = this.storageService.getStorage('cross_chain_swaps');
    const stakings = this.storageService.getStorage('stakings');
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

  async privateKeyBackup() {
    const privateKey = this.storageService.getSessionData('private_key');
    this.clipboardService.copy(privateKey);
    this.notificationMessagesService.privateKeyBackup();
  }
}
