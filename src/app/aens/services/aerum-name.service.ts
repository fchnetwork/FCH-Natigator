import { Injectable } from '@angular/core';

import { hash } from "eth-ens-namehash";

import { AensRegistryContractService } from '@app/aens/services/aens-registry-contract.service';
import { AensFixedPriceRegistrarContractService } from '@app/aens/services/aens-fixed-price-registrar-contract.service';
import { AensPublicResolverContractService } from '@app/aens/services/aens-public-resolver-contract.service';

@Injectable()
export class AerumNameService {

  constructor(
    private registryContractService: AensRegistryContractService,
    private registrarContractService: AensFixedPriceRegistrarContractService,
    private resolverContractService: AensPublicResolverContractService
  ) { }

  async resolveAddressFromName(name: string) : Promise<string> {
    if(!name || !name.endsWith(".aer")) {
      throw new Error('Can only resolve not empty names ending with .aer');
    }

    const node = hash(name);
    const address = await this.resolverContractService.getName(node);
    console.log(`Name ${name} resolved into: ${address}`);

    return address || null;
  }

  async isNameAvailable(name: string) : Promise<boolean> {
    if(!name || !name.endsWith(".aer")) {
      return false;
    }

    const node = hash(name);
    const owner = await this.registryContractService.getOwner(node);
    console.log("Owner: ", owner);

    return this.isEmptyAddress(owner);
  }

  async buyName(name: string, priceInWei: string) {
    if(!name || !name.endsWith(".aer")) {
      return false;
    }

    const node = hash(name);
    await this.registrarContractService.buy(node, priceInWei);
    // TODO: set resolver
    // TODO: set address
  }

  async setPrice(priceInWei: string) {
    await this.registrarContractService.setPrice(priceInWei);
  }

  async getPrice() {
    return await this.registrarContractService.getPrice();
  }

  async getBalance() {
    return await this.registrarContractService.balance();
  }

  async widthdraw(address: string, amountInWei: string) {
    await this.registrarContractService.widthdraw(address, amountInWei);
  }

  async transferOwnership(to: string) {
    await this.registrarContractService.setOwner(to);
  }

  async isRegistrarOwner(address: string) {
    const owner = await this.registrarContractService.owner();
    return owner.toUpperCase() === address.toUpperCase();
  }

  private isEmptyAddress(address: string) {
    return address === "0x0000000000000000000000000000000000000000";
  }
}
