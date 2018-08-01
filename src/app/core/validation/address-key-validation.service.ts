import { Injectable } from "@angular/core";

const ethWallet = require("ethereumjs-wallet");

@Injectable()
export class AddressKeyValidationService {
  constructor() {}

  isAddress(address: string): boolean {
    return address && new RegExp("^(0x)[0-9a-fA-F]{40}$").test(address);
  }

  isPrivateKey(privateKey: string): boolean {
    try {
      const privateKeyBuffer = Buffer.from(privateKey, "hex");
      const wallet = ethWallet.fromPrivateKey(privateKeyBuffer);

      return true;
    }
    catch {
      return false;
    }
  }
}
