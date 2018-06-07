import { Injectable } from '@angular/core';

import { privateToAddress, bufferToHex } from "ethereumjs-util";

@Injectable()
export class EthWalletService {

  constructor() { }

  // TODO: Mocked data
  getPrivateKey(): string {
    return "0xe0f95f7b4dd052594f7656171726f342dfea53af717d5bb85ab01e2a224dca14";
  }

  getAddress(): string {
    // "0xF38eDC62732c418EE18bEbf89CC063B3D1b57e0C"
    const address = bufferToHex(privateToAddress(this.getPrivateKey()));
    return address;
  }
}
