const artifacts = require('@core/abi/OpenAtomicSwapERC20.json');
const erc20ABI = require('@core/abi/tokens.ts');
import { toBigNumberString } from "@shared/helpers/number-utils";
import { Injectable } from '@angular/core';

import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { secondsToDate } from "@shared/helpers/date-util";
import { fromSolidityDecimalString } from "@shared/helpers/number-utils";

import { TokenService } from "@core/transactions/token-service/token.service";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";
import { OpenErc20Swap } from "@core/swap/models/open-erc20-swap.model";

@Injectable()
export class OpenAerumErc20SwapService extends BaseContractService {
  private environment: EnvironmentService;

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService,
    private tokenService: TokenService,
    environment: EnvironmentService) {
    super(
      artifacts.abi,
      environment.get().contracts.swap.crossChain.address.aerum.OpenErc20Swap,
      authenticationService,
      contractExecutorService
    );
    this.environment = environment;
  }

  /**
   * Opens a swap
   * @param {string} hash - hash of the swap
   * @param {string} erc20Address - address of ERC20 token contract
   * @param {string} value - amount of erc20 tokens
   * @param {string} withdrawTrader - address of counter partner trader
   * @param {number} timelock - time within, funds will be locked
   * @param {function} hashCallback - callback function with transaction hash
   */
  async openSwap(hash: string, erc20Address: string, value: string, withdrawTrader: string, timelock: number, approveCallback?: (hash: string) => void, hashCallback?: (hash: string) => void) {
    await this.tokenApprove(erc20Address, value, approveCallback);
    const openSwap = this.contract.methods.open(hash, value, erc20Address, withdrawTrader, toBigNumberString(timelock));
    const receipt = await this.contractExecutorService.send(openSwap, { value: '0', hashReceivedCallback: hashCallback });
    return receipt;
  }

  /**
   * Approves funds in ERC20 token for aerum erc20 contract
   * @param {string} erc20Address - ERC20 token address
   * @param {string} value - amount of ERC20 tokens
   */
  private async tokenApprove(erc20Address: string, value: string, approveCallback: (hash: string) => void) {
    const openErc20Swap = this.environment.get().contracts.swap.crossChain.address.aerum.OpenErc20Swap as string;
    const tokenContract = new this.web3.eth.Contract(erc20ABI.tokensABI, erc20Address);
    const approve = tokenContract.methods.approve(openErc20Swap, value);
    await this.contractExecutorService.send(approve, { value: '0', hashReceivedCallback: approveCallback });
  }

  /**
   * Estimates costs for open swap operation
   * @param {string} hash - hash of the swap
   * @param {string} erc20Address - address of ERC20 token contract
   * @param {string} value - amount of ERC20 tokens
   * @param {string} withdrawTrader - address of counter partner trader
   * @param {number} timelock - time within, funds will be locked
   */
  async estimateOpenSwap(hash: string, erc20Address: string, value: string, withdrawTrader: string, timelock: number) {
    const approveCost = await this.estimateTokenApprove(erc20Address, value);
    const openSwap = this.contract.methods.open(hash, value, erc20Address, withdrawTrader, timelock.toString(10));
    const openCost = await this.contractExecutorService.estimateCost(openSwap);
    return approveCost.concat(openCost);
  }

  private async estimateTokenApprove(erc20Address: string, value: string) {
    const openErc20Swap = this.environment.get().contracts.swap.crossChain.address.aerum.OpenErc20Swap as string;
    const tokenContract = new this.web3.eth.Contract(erc20ABI.tokensABI, erc20Address);
    const approve = tokenContract.methods.approve(openErc20Swap, value);
    const cost = await this.contractExecutorService.estimateCost(approve);
    return cost;
  }

  /**
   * Expires a swap
   * @param {string} hash - hash of the swap
   * @param {function} hashCallback - callback function with transaction hash
   */
  async expireSwap(hash: string, hashCallback?: (hash: string) => void) {
    const expireSwap = this.contract.methods.expire(hash);
    const receipt = await this.contractExecutorService.send(expireSwap, { value: '0', hashReceivedCallback: hashCallback });
    return receipt;
  }

  /**
   * Checks and returns information about swap
   * @param {string} hash - hash of the swap
   * @return {OpenErc20Swap} Swap object
   */
  async checkSwap(hash: string): Promise<OpenErc20Swap> {
    const checkSwap = this.contract.methods.check(hash);
    const response = await this.contractExecutorService.call(checkSwap);
    const token = await this.tokenService.safeGetTokensInfo(response.erc20ContractAddress);
    const swap: OpenErc20Swap = {
      hash,
      openTrader: response.openTrader,
      withdrawTrader: response.withdrawTrader,
      erc20Value: fromSolidityDecimalString(response.erc20Value, token.decimals),
      erc20ContractAddress: response.erc20ContractAddress,
      erc20Token: token,
      timelock: response.timelock,
      openedOn: secondsToDate(Number(response.openedOn)),
      state: Number(response.state)
    };
    return swap;
  }

  /**
   * Checks and returns secret key only for closed swaps
   * @param {string} hash - hash of the swap
   */
  async checkSecretKey(hash: string) {
    const checkSecretKey = this.contract.methods.checkSecretKey(hash);
    const response = await this.contractExecutorService.call(checkSecretKey);
    return response;
  }

  /**
   * Returns list of swap ids for specified account in open aerum erc20 contract
   * @param {string} address - account address
   * @return {string[]} List of swap ids
   */
  async getAccountSwapIds(address: string): Promise<string[]> {
    const getAccountSwaps = this.contract.methods.getAccountSwaps(address);
    const swapIds = await this.contractExecutorService.call(getAccountSwaps);
    return swapIds;
  }

}
