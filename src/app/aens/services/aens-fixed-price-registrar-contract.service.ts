const artifacts = require('./abi/FixedPriceRegistrar.json');

import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { ContractExecutorService } from '@app/shared/services/contract-executor.service';
import { BaseContractService } from '@app/shared/services/base-contract-service';

@Injectable()
export class AensFixedPriceRegistrarContractService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService
  ) {
    super(artifacts.abi, environment.contracts.aens.address.FixedPriceRegistrar, authenticationService, contractExecutorService);
  }

  async getPrice(): Promise<string> {
    const priceMethod = this.contract.methods.price();
    const price = await this.contractExecutorService.call(priceMethod);
    return price;
  }

  async setPrice(priceInWei: string) {
    const setPrice = this.contract.methods.setPrice(priceInWei);
    const receipt = await this.contractExecutorService.send(setPrice);
    return receipt;
  }

  async setOwner(owner: string) {
    const setOwner = this.contract.methods.setOwner(owner);
    const receipt = await this.contractExecutorService.send(setOwner);
    return receipt;
  }

  async widthdraw(to: string, amoutInWei: string) {
    const widthdraw = this.contract.methods.widthdraw(to , amoutInWei);
    const receipt = await this.contractExecutorService.send(widthdraw);
    return receipt;
  }

  async buy(node: string, price: string) {
    const buy = this.contract.methods.buy(node);
    const receipt = await this.contractExecutorService.send(buy, { value: price });
    return receipt;
  }

  async balance() {
    const balance = await this.web3.eth.getBalance(environment.contracts.aens.address.FixedPriceRegistrar);
    return balance;
  }

  async owner(): Promise<string> {
    const ownerField = this.contract.methods.owner();
    const owner = await this.contractExecutorService.call(ownerField);
    console.log(`Registrar owner: ${owner}`);
    return owner;
  }
}
