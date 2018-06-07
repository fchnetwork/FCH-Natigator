const artifacts = require('@core/abi/SwapTemplateRegistry.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { Chain } from "./chain.enum";
import { SwapTemplate } from "./swap-template.model";
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

  async getTemplateById(id: string) : Promise<SwapTemplate> {
    const templateById = this.contract.methods.templateById(this.web3.utils.fromAscii(id));
    const response = await this.contractExecutorService.call(templateById);
    const template = new SwapTemplate();
    template.id = this.web3.utils.toAscii(response[0]);
    template.owner = response[1];
    template.onchainAsset = response[2];
    template.onchainAccount = response[3];
    template.offchainAsset = response[4];
    template.offchainAccount = response[5];
    template.rate = Number(response[6]) / Math.pow(10, 18);
    template.chain = Chain[response[7] as string];
    return template;
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

  async getTemplates(chain: Chain) : Promise<SwapTemplate[]> {
    const templatesIds = await this.getTemplatesIds(chain);
    const promises = templatesIds.map((id) => this.getTemplateById(this.web3.utils.toAscii(id)));
    const templates = await Promise.all(promises);
    return templates;
  }

  async getTemplatesByAsset(asset: string, chain: Chain) : Promise<SwapTemplate[]> {
    const templatesIds = await this.getTemplatesIdsByAsset(asset, chain);
    const promises = templatesIds.map((id) => this.getTemplateById(this.web3.utils.toAscii(id)));
    const templates = await Promise.all(promises);
    return templates;
  }
}
