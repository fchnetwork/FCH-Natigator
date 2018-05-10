import { Injectable } from '@angular/core';

import { hash } from "eth-ens-namehash";

import { AenRegistryContractService } from '@app/aens/services/aen-registry-contract.service';

@Injectable()
// TODO: Rename this one
export class NameResolverService {

  constructor(private registryContractService: AenRegistryContractService) 
  { }

  async isNameAvailable(name: string) : Promise<boolean> {
    if(!name || !name.endsWith(".aer")) {
      return false;
    }

    const node = hash(name);
    const owner = await this.registryContractService.getOwner(node);
    console.log("Owner: ", owner);

    return this.isEmptyAddress(owner);
  }

  async resolveAddressFromName(name: string) : Promise<string> {
    return '';
  }

  private isEmptyAddress(address: string) {
    return address === "0x0000000000000000000000000000000000000000";
  }
}
