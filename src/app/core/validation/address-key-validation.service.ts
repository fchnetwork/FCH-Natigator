import { Injectable } from "@angular/core";

@Injectable()
export class AddressKeyValidationService {
  constructor() {}

  isAddress(address: string): boolean {
    return address && new RegExp("^(0x)[0-9a-fA-F]{40}$").test(address);
  }

  isPrivateKey(privateKey: string): boolean {
    return privateKey && new RegExp("^0x[a-fA-F0-9]{64}$").test(privateKey);
  }
}
