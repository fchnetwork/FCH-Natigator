import { TransactionService } from "@app/core/transactions/transaction-service/transaction.service";
import {
  Component,
  OnInit,
  Input,
  trigger,
  state,
  style,
  transition,
  group,
  animate
} from "@angular/core";
import { ImportWalletService } from "@app/core/transactions/import-wallet-service/import-wallet.service";

@Component({
  selector: "app-paper-wallet-import",
  templateUrl: "./paper-wallet-import.component.html",
  styleUrls: ["./paper-wallet-import.component.scss"],
  animations: [
    trigger("slideInOut", [
      state("in", style({ height: "*", opacity: 0 })),
      transition(":leave", [
        style({ height: "*" }),

        group([
          animate("500ms ease-in-out", style({ height: 0 }))
          //animate('200ms ease-in-out', style({'opacity': '0'}))
        ])
      ]),
      transition(":enter", [
        style({ height: "1px" }),

        group([
          animate("500ms ease-in-out", style({ height: "*" }))
          //animate('400ms ease-in-out', style({'opacity': '1'}))
        ])
      ])
    ])
  ]
})
export class PaperWalletImportComponent implements OnInit {
  @Input() privateKey: string;
  @Output() walletImported = new EventEmitter();
  balance = 0;
  expanded = false;

  constructor(
    private transaction: TransactionService,
    private importWallet: ImportWalletService
  ) {}

  async ngOnInit() {
    this.balance = await this.transaction.checkBalanceOfPrivateKey(this.privateKey);
    // NOTE: We don't allow importing to small amount as it doesn't make sense
    this.expanded = this.balance > 0.0001;
  }

  async import() {
    await this.importWallet.importWalletToCurrentAddress(this.privateKey);
    this.walletImported.emit();
    this.expanded = false;
  }

  cancel() {
    this.expanded = false;
  }
}
