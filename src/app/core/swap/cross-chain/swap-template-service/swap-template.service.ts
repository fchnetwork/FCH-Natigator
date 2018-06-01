const artifacts = require('@core/abi/SwapTemplateRegistry.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { Chain } from "@core/swap/cross-chain/swap-template-service/chain.enum";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";

@Injectable()
export class SwapTemplateService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService) {
    super(artifacts.abi, environment.contracts.swap.crossChain.address.aerum.TemplatesRegistry, authenticationService, contractExecutorService);
  }

  async registerTemplate(id: string, onchainAsset: string, onchainAccount: string, offchainAsset: string, offchainAccount: string, rate: number, chain: Chain) {
    const register = this.contract.methods.register(
      this.web3.utils.fromAscii(id),
      onchainAsset,
      onchainAccount,
      offchainAsset,
      offchainAccount,
      // TODO: Move to utils
      Math.ceil(rate * Math.pow(10, 18)).toString(10),
      chain
    );
    const receipt = await this.contractExecutorService.send(register);
    return receipt;
  }

  async removeTemplate(id: string) {
    const remove = this.contract.methods.remove(this.web3.utils.fromAscii(id));
    const receipt = await this.contractExecutorService.send(remove);
    return receipt;
  }

  async getTemplateById(id: string) {
    const templateById = this.contract.methods.templateById(this.web3.utils.fromAscii(id));
    const response = await this.contractExecutorService.call(templateById);
    return response;
  }

  async getTemplatesIds(chain: Chain) : Promise<string[]> {
    const templatesIds = this.contract.methods.templatesIds(chain);
    const response = await this.contractExecutorService.call(templatesIds);
    return response;
  }

  async getTemplatesIdsByAsset(asset: string, chain: Chain) : Promise<string[]> {
    const templatesIdsByAsset = this.contract.methods.templatesIdsByAsset(asset, chain);
    const response = await this.contractExecutorService.call(templatesIdsByAsset);
    return response;
  }
}
