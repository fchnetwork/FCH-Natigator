import { Injectable } from '@angular/core';
import { NotificationService } from '@aerum/ui';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class NotificationMessagesService {

constructor(private notificationService: NotificationService,
            private translateService: TranslateService) { }

    protected translate(key: string): string {
        return this.translateService.instant(key);
    }

    /**
     *Shows notification when transaction status has changed to SUCCESSFULL
     *
     * @param {*} hash Transaction hash
     * @memberof NotificationMessagesService
     */
    public succefullSentNotification(hash) {
        this.notificationService.notify(
            `${this.translate('SEND_RECEIVE.NOTIFICATION_TITLE_TRANSACTION_STATUS')}: ${this.translate('SEND_RECEIVE.STATUSES.SUCCESFULLY_SENT')}`,
            `${this.translate('SEND_RECEIVE.TRANSACTION')} ${hash} ${this.translate('SEND_RECEIVE.IS')} ${this.translate('SEND_RECEIVE.STATUSES.SUCCESFULLY_SENT')}`,
          'transaction', 
          10000
        );
      }
  
      /**
       *Shows notification when transaction has failed
       *
       * @memberof NotificationMessagesService
       */
      public failedTransactionNotification() {
        this.notificationService.notify(
          `${this.translate('SEND_RECEIVE.NOTIFICATION_TITLE_TRANSACTION_STATUS')}: ${this.translate('SEND_RECEIVE.STATUSES.FAILED')}`, 
          this.translate('SEND_RECEIVE.STATUSES.FAILED'), 
          'aerumleaf', 
          10000
        );
      }
  
      /**
       *Shows notification when transaction status has changed to PENDING
       *
       * @param {*} hash Transaction hash
       * @memberof NotificationMessagesService
       */
      public pendingTransactionNotification(hash) {
        this.notificationService.notify(
          `${this.translate('SEND_RECEIVE.NOTIFICATION_TITLE_TRANSACTION_STATUS')}: ${this.translate('SEND_RECEIVE.STATUSES.PENDING')}`, 
          `${this.translate('SEND_RECEIVE.TRANSACTION')} ${hash} ${this.translate('SEND_RECEIVE.IS')} ${this.translate('SEND_RECEIVE.STATUSES.PENDING')}`,
          'pending', 
          10000
        );
      }
  
      /**
       *Shows notification when transaction has been mined
       *
       * @param {*} hash Transaction hash
       * @memberof NotificationMessagesService
       */
      public transactionMinedNotification(hash) {
        this.notificationService.notify(
          `${this.translate('SEND_RECEIVE.NOTIFICATION_TITLE_TRANSACTION_STATUS')}: ${this.translate('SEND_RECEIVE.STATUSES.MINED')}`, 
          `${this.translate('SEND_RECEIVE.TRANSACTION')} ${hash} ${this.translate('SEND_RECEIVE.HAS_BEEN')} ${this.translate('SEND_RECEIVE.STATUSES.MINED')}`,
          'pending', 
          10000
        );
      }

      /**
       *Shows notification when Aerum DISCONNECTED from network
       *
       * @memberof NotificationMessagesService
       */
      public connectionDisconnected() {
        this.notificationService.notify(
          `${this.translate('CONNECTION.CONNECTION_STATUS')}: ${this.translate('CONNECTION.STATUS_TITLE.DISCONNECTED')}`, 
          this.translate('CONNECTION.STATUS_BODY.DISCONNECTED'), 
          'blocks', 
          10000
        );
      }

      /**
       *Shows notification when Aerum CONNECTED to network
       *
       * @memberof NotificationMessagesService
       */
      public connectionConnected() {
        this.notificationService.notify(
          `${this.translate('CONNECTION.CONNECTION_STATUS')}: ${this.translate('CONNECTION.STATUS_TITLE.CONNECTED')}`,
          this.translate('CONNECTION.STATUS_BODY.CONNECTED'), 
          'blocks', 
          10000
        );
      }

      /**
       *Show notification when language has been changed
       *
       * @param {*} language
       * @memberof NotificationMessagesService
       */
      public langugeChanged(language) {
        this.notificationService.notify(
          `${this.translate('SETTINGS.GENERAL.NOTIFICATIONS.CHANGE_LANGUAGE.TITLE')}`, 
          `${this.translate('SETTINGS.GENERAL.NOTIFICATIONS.CHANGE_LANGUAGE.BODY')} ${language}`,
          'translation', 
          10000
        );
      }

      /**
       *Shows notification if token is not in the cookies
       *
       * @memberof NotificationMessagesService
       */
      public tokenNotInTheCookies() {
        this.notificationService.notify(
          `${this.translate('EXTERNAL_TRANSACTION.NOTIFICATION_TITLE_TOKEN_NOT_IN_WALLET')}`, 
          `${this.translate('EXTERNAL_TRANSACTION.NOTIFICATION_BODY_TOKEN_NOT_IN_WALLET')}`,
          'info', 
          10000
        );
      }

      /**
       *Shows notification if token is not configured
       *
       * @memberof NotificationMessagesService
       */
      public tokenNotConfigured() {
        this.notificationService.notify(
          `${this.translate('EXTERNAL_TRANSACTION.NOTIFICATION_TITLE_TOKEN_NOT_CONFIGURED')}`, 
          `${this.translate('EXTERNAL_TRANSACTION.NOTIFICATION_BODY_TOKEN_NOT_CONFIGURED')}`,
          'exclamation-triangle', 
          10000
        );
      }

      /**
       *Shows notification when settings has been saved
       *
       * @memberof NotificationMessagesService
       */
      public saveSettings() {
        this.notificationService.notify(
          `${this.translate('SETTINGS.COMMON.NOTIFICATIONS.SAVE_SETTINGS.TITLE')}`, 
          `${this.translate('SETTINGS.COMMON.NOTIFICATIONS.SAVE_SETTINGS.TITLE')}`,
          'check-square-o', 
          10000
        );
      }

      /**
       *Shows notification when full backup file has been downloaded
       *
       * @memberof NotificationMessagesService
       */
      public fullBackup() {
        this.notificationService.notify(
          `${this.translate('SETTINGS.BACKUP.NOTIFICATIONS.SAVE_FULL_BACKUP.TITLE')}`, 
          `${this.translate('SETTINGS.BACKUP.NOTIFICATIONS.SAVE_FULL_BACKUP.BODY')}`,
          'check-square-o', 
          10000
        );
      }

      /**
       *Shows notification when seed phrase has been downloaded
       *
       * @memberof NotificationMessagesService
       */
      public simpleBackup() {
        this.notificationService.notify(
          `${this.translate('SETTINGS.BACKUP.NOTIFICATIONS.SAVE_SIMPLE_BACKUP.TITLE')}`, 
          `${this.translate('SETTINGS.BACKUP.NOTIFICATIONS.SAVE_SIMPLE_BACKUP.BODY')}`,
          'check-square-o', 
          10000
        );
      }

     /**
      * Shows notification when derivation path has been modified
      *
      * @param {string} derivation New derivation
      * @memberof NotificationMessagesService
      */
     public derivationModified(derivation: string) {
        this.notificationService.notify(
          `${this.translate('SETTINGS.GENERAL.NOTIFICATIONS.CHANGE_DERIVATION.TITLE')}`, 
          `${this.translate('SETTINGS.GENERAL.NOTIFICATIONS.CHANGE_DERIVATION.BODY')} ${derivation}`,
          'check-square-o', 
          10000
        );
      }
}
