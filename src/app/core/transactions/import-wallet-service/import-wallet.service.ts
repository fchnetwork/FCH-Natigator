import { PendingTransactionsService } from './../pending-transactions/pending-transactions.service';
import { NotificationMessagesService } from "@core/general/notification-messages-service/notification-messages.service";
import { StorageService } from "@app/core/general/storage-service/storage.service";
import { TransactionService } from "@app/core/transactions/transaction-service/transaction.service";
import { AuthenticationService } from "./../../authentication/authentication-service/authentication.service";
import { Injectable } from "@angular/core";
import { TransactionStatus } from '@app/shared/app.interfaces';

const ethWallet = require("ethereumjs-wallet");

@Injectable()
export class ImportWalletService {
  constructor(
    private authService: AuthenticationService,
    private transactionService: TransactionService,
    private storageService: StorageService,
    private notification: NotificationMessagesService,
    private pendingTxn: PendingTransactionsService
  ) {}

  async importWalletToCurrentAddress(privateKey: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const address = this.storageService.getSessionData("acc_address");
        const privateKeyBuffer = Buffer.from(privateKey, "hex");

        const paperWallet = ethWallet.fromPrivateKey(privateKeyBuffer);
        const paperWalletAddress = paperWallet.getChecksumAddressString();
        const paperWalletBalance = await this.transactionService.checkBalance(
          paperWalletAddress
        );

        const res = await this.transactionService.maxTransactionFee(
          paperWalletAddress,
          "Gas"
        );
        const maxTransactionFeeEth = res[1];
        const amount =
          Number(paperWalletBalance) - Number(maxTransactionFeeEth);

        this.notification.importWalletProcessing(paperWalletAddress, amount);

        this.transactionService
          .transaction(
            privateKey,
            paperWalletAddress,
            address,
            amount,
            null,
            false,
            {},
            null,
            {
              data: "",
              limit: "",
              price: "",
              selectedToken: "Gas"
            }
          )
          .then(async result => {
            await this.pendingTxn.subscribeByHash(result.hash, TransactionStatus.Successfull);
            this.notification.importWalletSuccessfulll();
            resolve();
          });
      } catch (e) {
        reject(e);
      }
    });
  }
}
