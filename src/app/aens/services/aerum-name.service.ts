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

  // TODO: Implement
  async resolveAddressFromName(name: string) : Promise<string> {
    return '';
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
  }

  async setPrice(priceInWei: string) {
    await this.registrarContractService.setPrice(priceInWei);
  }

  async getPrice() {
    return await this.registrarContractService.getPrice();
  }

  private isEmptyAddress(address: string) {
    return address === "0x0000000000000000000000000000000000000000";
  }
}
