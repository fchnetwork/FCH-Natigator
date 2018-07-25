import { Injectable } from '@angular/core';
import { StorageService } from "@core/general/storage-service/storage.service";
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';

@Injectable()
export class SettingsBackupService {

  constructor(private storageService: StorageService,
              private notificationMessagesService: NotificationMessagesService
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
    const data = this.storageService.getSessionData('seed');
    const preparedData = {
      seed: data
    };
    this.generateFile(preparedData, 'seed_backup', 'seed');
    this.notificationMessagesService.simpleBackup();
  }

  fullBackup() {
    const aerumBase = this.storageService.getCookie('aerum_base');
    const aerumKeyStore = this.storageService.getCookie('aerum_keyStore');
    const tokens = this.storageService.getCookie('tokens');
    const ethereumTokens = this.storageService.getCookie('ethereum_tokens');
    const transactions = this.storageService.getCookie('transactions');
    const settings = this.storageService.getCookie('settings');

    const ethereumAccounts = this.storageService.getCookie('ethereum_accounts');
    const crossChainSwaps = this.storageService.getCookie('cross_chain_swaps');
    const preparedData = {
      aerumBase,
      aerumKeyStore,
      tokens,
      ethereumTokens,
      transactions,
      settings,
      ethereumAccounts,
      crossChainSwaps
    };
    this.generateFile(preparedData, 'full_backup', 'full');
    this.notificationMessagesService.fullBackup();
  }
}
