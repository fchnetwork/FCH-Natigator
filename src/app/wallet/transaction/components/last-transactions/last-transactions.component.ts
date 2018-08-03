import { Component, OnInit, OnDestroy } from "@angular/core";
import { TransactionService } from "@app/core/transactions/transaction-service/transaction.service";
import { ModalService } from "@app/core/general/modal-service/modal.service";
import { iTransaction } from "@shared/app.interfaces";
import { ExplorerService } from "@app/core/explorer/explorer-service/explorer.service";
import { SettingsService } from "@app/core/settings/settings.service";
import { TransactionModalData } from "@app/wallet/explorer/components/transaction-modal/transaction-modal.component";
import { StorageService } from "@core/general/storage-service/storage.service";

@Component({
  selector: "app-last-transactions",
  templateUrl: "./last-transactions.component.html",
  styleUrls: ["./last-transactions.component.scss"]
})
export class LastTransactionsComponent implements OnInit, OnDestroy {
  transactions: iTransaction[] = [];
  limit: number;
  hideTxns: boolean = false;
  checkForTransactions = null;
  updateTransactions = null;

  constructor(
    private storageService: StorageService,
    private transactionService: TransactionService,
    private modalService: ModalService,
    public explorerService: ExplorerService,
    public settingsService: SettingsService
  ) {
    this.limit = Number(
      this.settingsService.settings.transactionSettings.lastTransactionsNumber
    );

    this.checkForTransactions = setInterval(() => {
      const sessionTransaactions = this.storageService.getSessionData(
        "transactions"
      );

      if (sessionTransaactions) {
        this.transactions = sessionTransaactions.sort((b, a) => {
          const c: any = new Date(a.date);
          const d: any = new Date(b.date);
          return c - d;
        });
      }
    }, 3000);
    this.updateTransactions = setInterval(() => {
      for (let i = 0; i < this.transactions.length; i++) {
        if (
          this.transactions[i].data === "Pending transaction" ||
          this.transactions[i].data === "Contract execution(pending)"
        ) {
          this.transactionService.updateTransactionsStatuses(this.transactions);
        }
      }
    }, 5000);
  }

  getICoin(amount) {
    return amount > 0;
  }

  loadMoreTransactions() {
    this.limit += Number(
      this.settingsService.settings.transactionSettings.lastTransactionsNumber
    );
    if (this.limit >= this.transactions.length) {
      this.hideTxns = true;
    }
  }

  hideTransactions() {
    this.limit = Number(
      this.settingsService.settings.transactionSettings.lastTransactionsNumber
    );
    this.hideTxns = false;
  }

  ngOnInit() {}

  ngOnDestroy() {
    if(this.checkForTransactions) clearInterval(this.checkForTransactions);
    if(this.updateTransactions) clearInterval(this.updateTransactions);
  }

  async openTransaction(transaction) {
    const response = await this.explorerService.getTransactionByHash(
      transaction.hash
    );
    const data: TransactionModalData = {
      hash: transaction.hash,
      transaction: response,
      external: false,
      orderId: null,
      urls: null
    };

    await this.modalService.openTransaction(data);
  }
}
