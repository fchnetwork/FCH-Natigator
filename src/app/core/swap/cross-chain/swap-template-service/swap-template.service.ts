const artifacts = require('@core/abi/SwapTemplateRegistry.json');

import { Injectable } from '@angular/core';
import { EnvironmentService } from "@core/general/environment-service/environment.service";

import { toSolidityDecimalString } from "@shared/helpers/number-utils";
import { filterAsync } from "@shared/helpers/array-utils";
import { unique } from "@shared/helpers/array-utils";
import { Chain } from "./chain.enum";
import { SwapTemplate } from "./swap-template.model";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";
import { AerumNameService } from "@core/aens/aerum-name-service/aerum-name.service";

@Injectable()
export class SwapTemplateService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService,
    private nameService: AerumNameService,
    environment: EnvironmentService) {
    super(artifacts.abi, environment.get().contracts.swap.crossChain.address.aerum.TemplatesRegistry, authenticationService, contractExecutorService);
  }

  async registerTemplate(id: string, onchainAsset: string, onchainAccount: string, offchainAsset: string, offchainAccount: string, rate: number, chain: Chain) {
    const register = this.contract.methods.register(
      this.web3.utils.fromAscii(id),
      onchainAsset.toLowerCase(),
      onchainAccount.toLowerCase(),
      offchainAsset.toLowerCase(),
      offchainAccount.toLowerCase(),
      toSolidityDecimalString(rate),
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
    template.id = response[0];
    template.owner = response[1].toLowerCase();
    template.onchainAsset = response[2].toLowerCase();
    template.onchainAccount = response[3].toLowerCase();
    template.offchainAsset = response[4].toLowerCase();
    template.offchainAccount = response[5].toLowerCase();
    template.rate = Number(response[6]) / Math.pow(10, 18);
    template.chain = Chain[response[7] as string];
    return template;
  }

  async getTemplatesIds(chain: Chain) : Promise<string[]> {
    const templatesIdsMethod = this.contract.methods.templatesIds(chain);
    const templateIds: string[] = await this.contractExecutorService.call(templatesIdsMethod);
    // NOTE: We get unique template ids due to next bug in contract:
    // If you delete template & add with the same id two will be returned back
    const uniqueTemplateIds = unique(templateIds);
    return uniqueTemplateIds;
  }

  async getTemplatesIdsByAsset(asset: string, chain: Chain) : Promise<string[]> {
    const templatesIdsByAsset = this.contract.methods.templatesIdsByAsset(asset.toLowerCase(), chain);
    const templateIds: string[] = await this.contractExecutorService.call(templatesIdsByAsset);
    // NOTE: We get unique template ids due to next bug in contract:
    // If you delete template & add with the same id two will be returned back
    const uniqueTemplateIds = unique(templateIds);
    return uniqueTemplateIds;
  }

  async getTemplates(chain: Chain) : Promise<SwapTemplate[]> {
    const templatesIds = await this.getTemplatesIds(chain);
    const promises = templatesIds.map((id) => this.getTemplateById(this.web3.utils.toAscii(id)));
    const templates = await Promise.all(promises);
    return templates;
  }

  async getTemplatesByAsset(asset: string, offchainAsset: string, chain: Chain) : Promise<SwapTemplate[]> {
    const templates = await this.getTemplates(chain);
    const swapTemplates =  (
      await filterAsync(templates, async t => {
        const result = await this.nameService.safeResolveNameOrAddress(t.onchainAsset);
        return result === asset.toLowerCase()
          && (t.offchainAsset === offchainAsset.toLowerCase() || (offchainAsset.toLowerCase() === '0x0' && t.offchainAsset === '')); //Check to look for ETH templates
      })
    ).map(r => r as SwapTemplate);
    return swapTemplates;
  }

  async getTemplatesByOffchainAsset(asset: string, onchainAsset: string, chain: Chain) : Promise<SwapTemplate[]> {
    const templates = await this.getTemplates(chain);
    const swapTemplates =  (
      await filterAsync(templates, async t => {
        const result = await this.nameService.safeResolveNameOrAddress(t.offchainAsset);
        return result === asset.toLowerCase()
          && (t.onchainAsset === onchainAsset.toLowerCase() || (onchainAsset.toLowerCase() === '0x0' && t.onchainAsset === '')); //Check to look for ETH templates
      })
    ).map(r => r as SwapTemplate);
    return swapTemplates;
  }
}
