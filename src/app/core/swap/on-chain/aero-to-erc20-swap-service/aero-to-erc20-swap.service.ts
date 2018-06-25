const artifacts = require('@core/abi/AtomicSwapEtherToERC20.json');

import { Injectable } from '@angular/core';

import { environment } from "@env/environment";

import { fromWei } from "web3-utils";
import { fromSolidityDecimalString } from "@shared/helpers/number-utils";
import { secondsToDate } from "@shared/helpers/date-util";

import { TokenService } from "@core/transactions/token-service/token.service";
import { AeroToErc20Swap } from "@core/swap/on-chain/aero-to-erc20-swap-service/aero-to-erc20-swap.model";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";

@Injectable()
export class AeroToErc20SwapService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService,
    private tokenService: TokenService,
  ) {
    super(artifacts.abi, environment.contracts.swap.address.AeroToErc20, authenticationService, contractExecutorService);
  }

  async openSwap(swapId: string, aeroValue: string, erc20Value: string, erc20Trader: string, erc20ContractAddress: string) {
    const openSwap = this.contract.methods.open(
      this.web3.utils.fromAscii(swapId),
      erc20Value,
      erc20Trader,
      erc20ContractAddress
    );
    const receipt = await this.contractExecutorService.send(openSwap, {value: aeroValue});
    return receipt;
  }

  async closeSwap(swapId: string) {
    const closeSwap = this.contract.methods.close(this.web3.utils.fromAscii(swapId));
    const receipt = await this.contractExecutorService.send(closeSwap);
    return receipt;
  }

  async expireSwap(swapId: string) {
    const expireSwap = this.contract.methods.expire(this.web3.utils.fromAscii(swapId));
    const receipt = await this.contractExecutorService.send(expireSwap);
    return receipt;
  }

  // TODO: Remove this in favour of detailed version
  async checkSwap(swapId: string) {
    const checkSwap = this.contract.methods.check(this.web3.utils.fromAscii(swapId));
    const response = await this.contractExecutorService.call(checkSwap);
    return response;
  }

  async checkSwapDetailed(swapId: string): Promise<AeroToErc20Swap> {
    const checkSwap = this.contract.methods.check(this.web3.utils.fromAscii(swapId));
    const response = await this.contractExecutorService.call(checkSwap);
    const token = await this.tokenService.getSaveTokensInfo(response.erc20ContractAddress);
    const swap: AeroToErc20Swap = {
      id: swapId,
      erc20Trader: response.erc20Trader,
      erc20Value: fromSolidityDecimalString(response.erc20Value, token.decimals),
      erc20Token: token,
      ethTrader: response.ethTrader,
      ethValue: fromWei(response.ethValue, 'ether'),
      openedOn: secondsToDate(Number(response.openedOn)),
      state: Number(response.state)
    };
    return swap;
  }

  async getAccountSwapIds(address: string): Promise<string[]> {
    const getAccountSwaps = this.contract.methods.getAccountSwaps(address);
    const swapIds = await this.contractExecutorService.call(getAccountSwaps);
    return swapIds.map(id => this.web3.utils.toAscii(id));
  }
}
