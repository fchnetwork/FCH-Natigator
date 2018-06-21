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

    //NOTIFICATIONS

    //SUCCESFULL transaction notification
    public succefullSentNotification(hash) {
        this.notificationService.notify(
            `${this.translate('SEND_RECEIVE.NOTIFICATION_TITLE_TRANSACTION_STATUS')}: ${this.translate('SEND_RECEIVE.STATUSES.SUCCESFULLY_SENT')}`,
            `${this.translate('SEND_RECEIVE.TRANSACTION')} ${hash} ${this.translate('SEND_RECEIVE.IS')} ${this.translate('SEND_RECEIVE.STATUSES.SUCCESFULLY_SENT')}`,
          'transaction', 
          10000
        );
      }
  
      //FAILED transaction notification
      public failedTransactionNotification() {
        this.notificationService.notify(
          `${this.translate('SEND_RECEIVE.NOTIFICATION_TITLE_TRANSACTION_STATUS')}: ${this.translate('SEND_RECEIVE.STATUSES.FAILED')}`, 
          this.translate('SEND_RECEIVE.STATUSES.FAILED'), 
          'aerumleaf', 
          10000
        );
      }
  
      //PENDING transaction notification
      public pendingTransactionNotification(hash) {
        this.notificationService.notify(
          `${this.translate('SEND_RECEIVE.NOTIFICATION_TITLE_TRANSACTION_STATUS')}: ${this.translate('SEND_RECEIVE.STATUSES.PENDING')}`, 
          `${this.translate('SEND_RECEIVE.TRANSACTION')} ${hash} ${this.translate('SEND_RECEIVE.IS')} ${this.translate('SEND_RECEIVE.STATUSES.PENDING')}`,
          'pending', 
          10000
        );
      }
  
      //MINED transaction notification
      public transactionMinedNotification(hash) {
        this.notificationService.notify(
          `${this.translate('SEND_RECEIVE.NOTIFICATION_TITLE_TRANSACTION_STATUS')}: ${this.translate('SEND_RECEIVE.STATUSES.MINED')}`, 
          `${this.translate('SEND_RECEIVE.TRANSACTION')} ${hash} ${this.translate('SEND_RECEIVE.HAS_BEEN')} ${this.translate('SEND_RECEIVE.STATUSES.MINED')}`,
          'pending', 
          10000
        );
      }

      //DISCONNECTED to AERUM network
      public connectionDisconnected() {
        this.notificationService.notify(
          `${this.translate('CONNECTION.CONNECTION_STATUS')}: ${this.translate('CONNECTION.STATUS_TITLE.DISCONNECTED')}`, 
          this.translate('CONNECTION.STATUS_BODY.DISCONNECTED'), 
          'blocks', 
          10000
        );
      }

      //CONNECTED to AERUM network
      public connectionConnected() {
        this.notificationService.notify(
          `${this.translate('CONNECTION.CONNECTION_STATUS')}: ${this.translate('CONNECTION.STATUS_TITLE.CONNECTED')}`,
          this.translate('CONNECTION.STATUS_BODY.CONNECTED'), 
          'blocks', 
          10000
        );
      }

      //Change the language
      public langugeChanged(language) {
        this.notificationService.notify(
          `${this.translate('SETTINGS.LANGUAGE.NOTIFICATION_TITLE_CHANGE_LANGUAGE')}`, 
          `${this.translate('SETTINGS.LANGUAGE.NOTIFICATION_BODY_CHANGE_LANGUAGE')} ${language}`,
          'translation', 
          10000
        );
      }

      //Shows if token is not in the cookies
      public tokenNotInTheCookies() {
        this.notificationService.notify(
          `${this.translate('EXTERNAL_TRANSACTION.NOTIFICATION_TITLE_TOKEN_NOT_IN_WALLET')}`, 
          `${this.translate('EXTERNAL_TRANSACTION.NOTIFICATION_BODY_TOKEN_NOT_IN_WALLET')}`,
          'info', 
          10000
        );
      }

      //Shows if token is not configured
      public tokenNotConfigured() {
        this.notificationService.notify(
          `${this.translate('EXTERNAL_TRANSACTION.NOTIFICATION_TITLE_TOKEN_NOT_CONFIGURED')}`, 
          `${this.translate('EXTERNAL_TRANSACTION.NOTIFICATION_BODY_TOKEN_NOT_CONFIGURED')}`,
          'exclamation-triangle', 
          10000
        );
      }
}
