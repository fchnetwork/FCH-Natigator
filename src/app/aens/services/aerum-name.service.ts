import { Injectable } from '@angular/core';

import { hash } from "eth-ens-namehash";

import { AensRegistryContractService } from '@app/aens/services/aens-registry-contract.service';

@Injectable()
export class AerumNameService {

  constructor(private registryContractService: AensRegistryContractService) 
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
