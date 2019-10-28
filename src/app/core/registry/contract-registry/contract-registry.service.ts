const artifacts = require('@core/abi/ContractRegistry.json');

import { Injectable } from '@angular/core';

import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";

import { ContractRegistry } from "@app/core/registry/models/contract-registry.models";

@Injectable()
export class ContractRegistryService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService,
    environment: EnvironmentService) {
    super(
      artifacts.abi,
      environment.get().contracts.contractRegistry.address,
      authenticationService,
      contractExecutorService
    );
  }

  /**
   * Returns a valid contract
   * @param {string} address - contract registry address
   */
  async getContract(address: string): Promise<ContractRegistry> {
    const getContract = this.contract.methods.getContract(address);
    const result = await this.contractExecutorService.call(getContract);
    return {
      addr: result[0],
      name: result[1],
      abi: result[2],
      manager: result[3]
    };
  }

  /**
   * Adds new contarct to the ContractRegistry
   * @param {string} address - contracts address
   * @param {string} name - contracts name
   * @param {string} abi - contracts abi
   */
  async addContract(address: string, name: string, abi: string) {
    const addContract = this.contract.methods.addContract(address, name, abi);
    const receipt = await this.contractExecutorService.send(addContract);
    return receipt;
  }

  /**
   * Adds new manager to the ContractRegistry
   * @param {string} address - manager address
   * @param {string} name - managers name
   * @param {string} company - company name
   */
  async addManager(address: string, name: string, company: string) {
    const addManager = this.contract.methods.addManager(address, name, company);
    const receipt = await this.contractExecutorService.send(addManager);
    return receipt;
  }
}
