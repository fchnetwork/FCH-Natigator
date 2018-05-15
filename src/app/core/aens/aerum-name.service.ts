import { Injectable } from '@angular/core'; 
import { hash } from "eth-ens-namehash"; 
import Web3 from 'web3';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { AensRegistryContractService } from '@app/core/aens/aens-registry-contract.service';
import { AensFixedPriceRegistrarContractService } from '@app/core/aens/aens-fixed-price-registrar-contract.service';
import { AensPublicResolverContractService } from '@app/core/aens/aens-public-resolver-contract.service';

@Injectable()
export class AerumNameService {

  web3: Web3;

  constructor(
    private authService: AuthenticationService,
    private registryContractService: AensRegistryContractService,
    private registrarContractService: AensFixedPriceRegistrarContractService,
    private resolverContractService: AensPublicResolverContractService
  ) {
    this.web3 = this.authService.initWeb3();
  }

  async resolveNameOrAddress(nameOrAddress: string) {
    if(nameOrAddress.endsWith(".aer")) {
      return this.resolveAddressFromName(nameOrAddress);
    }

    return nameOrAddress;
  }

  async resolveAddressFromName(name: string) : Promise<string> {
    if(!name || !name.endsWith(".aer")) {
      throw new Error('Can only resolve not empty names ending with .aer');
    }

    const node = hash(name);
    const address = await this.resolverContractService.getAddress(node);
    console.log(`Name ${name} resolved into: ${address}`);

    return address || null;
  }

  async isNameAvailable(name: string) : Promise<boolean> {
    if(!name || !name.endsWith(".aer")) {
      return false;
    }

    const node = hash(name);
    const owner = await this.registryContractService.getOwner(node);
    console.log("Name owner: ", owner);

    return this.isEmptyAddress(owner);
  }

  async buyName(label: string, address: string, priceInWei: string) {
    if(!label) {
      throw new Error('Can only resolve not empty names ending with .aer');
    }

    const name = label + ".aer";
    const node = hash(name);
    const hashedLabel = this.web3.utils.sha3(label);
    
    if(!await this.isNodeOwner(node, address)) {
      await this.registrarContractService.buy(hashedLabel, priceInWei);
    }
    await this.registryContractService.setResolver(node, this.resolverContractService.getContractAddress());
    await this.resolverContractService.setAddress(node, address);
  }

  async estimateBuyNameCost(label: string, address: string, priceInWei: string) {
    if(!label) {
      throw new Error('Can only resolve not empty names ending with .aer');
    }

    const name = label + ".aer";
    const node = hash(name);
    const hashedLabel = this.web3.utils.sha3(label);
    
    let buyCost = [0, 0, 0];
    if(!await this.isNodeOwner(node, address)) {
      buyCost = await this.registrarContractService.estimateBuyCost(hashedLabel, priceInWei);
    }
 
    const cost = buyCost;
    return cost;
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

  async isNodeOwner(node: string, address: string) {
    const owner = await this.registryContractService.getOwner(node);
    return owner.toUpperCase() === address.toUpperCase();
  }

  private isEmptyAddress(address: string) {
    return address === "0x0000000000000000000000000000000000000000";
  }
}
