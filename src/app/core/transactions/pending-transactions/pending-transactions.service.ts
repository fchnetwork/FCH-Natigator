import { hash } from "eth-ens-namehash";
import { iPendingTxn, iTransaction, TransactionStatus } from "@shared/app.interfaces";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { StorageService } from "@app/core/general/storage-service/storage.service";
import { TransactionService } from "@app/core/transactions/transaction-service/transaction.service";

@Injectable()
export class PendingTransactionsService implements OnDestroy {
  transactionsUpdated$ = new Subject<iTransaction>();

  private updatePeningTransaction = null;

  constructor(
    private storageService: StorageService,
    private transactionService: TransactionService
  ) {
    this.updatePeningTransaction = setInterval(() => {
      const sessionTransaactions = this.storageService.getSessionData(
        "transactions"
      );

      if (sessionTransaactions) {
        for (let i = 0; i < sessionTransaactions.length; i++) {
          if (
            sessionTransaactions[i].data === "Pending transaction" ||
            sessionTransaactions[i].data === "Contract execution(pending)"
          ) {
            this.transactionService.updateTransactionsStatuses(
              sessionTransaactions
            );
          }
        }

        const sortedTransactions = sessionTransaactions.sort((b, a) => {
          const c: any = new Date(a.date);
          const d: any = new Date(b.date);
          return c - d;
        });

        for (let tnx of sortedTransactions) {
          this.transactionsUpdated$.next(tnx);
        }
      }
    }, 2000);
  }

  ngOnDestroy() {
    this.transactionsUpdated$ = null;
    clearInterval(this.updatePeningTransaction);
  }

  subscribeByHash(hash: string, status: TransactionStatus): Promise<iTransaction> {
    return new Promise<iTransaction>((resolve, reject) => {
      this.transactionsUpdated$
        .first(value => value.hash === hash && value.data === status)
        .subscribe(tnx => {
          resolve(tnx);
        });
    });
  }
}
