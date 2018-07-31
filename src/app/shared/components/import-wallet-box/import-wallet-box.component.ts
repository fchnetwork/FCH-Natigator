import { Component, OnInit, Input } from "@angular/core";

import { Wallet } from "ethereumjs-wallet";
import { AddressKeyValidationService } from "@app/core/validation/address-key-validation.service";
import { ImportWalletService } from "@app/core/transactions/import-wallet-service/import-wallet.service";

@Component({
  selector: "app-import-wallet-box",
  templateUrl: "./import-wallet-box.component.html",
  styleUrls: ["./import-wallet-box.component.scss"]
})
export class ImportWalletBoxComponent implements OnInit {
  @Input() privateKey: string;

  constructor(
    private addressKeyValidator: AddressKeyValidationService,
    private importWalletService: ImportWalletService
  ) {}

  ngOnInit() {}

  isValid(): boolean {
    return this.addressKeyValidator.isPrivateKey(this.privateKey);
  }

  importWallet() {
    if (this.isValid()) {
      this.importWalletService.importWalletToCurrentAddress(this.privateKey).then(w=> console.log('Done')).catch(error=> console.log(error));
    }
  }
}
