const artifacts = require('@core/abi/AtomicSwapERC20ToEther.json');

import { Injectable } from '@angular/core';

import { environment } from "@env/environment";

import { fromWei } from "web3-utils";
import { toNumber } from "@shared/helpers/number-utils";
import { secondsToDate } from "@shared/helpers/date-util";

import { TokenService } from "@core/transactions/token-service/token.service";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";
import { Erc20ToAeroSwap } from "@core/swap/on-chain/erc20-to-aero-swap-service/erc20-to-aero-swap.model";

@Injectable()
export class Erc20ToAeroSwapService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService,
    private tokenService: TokenService,
  ) {
    super(artifacts.abi, environment.contracts.swap.address.Erc20ToAero, authenticationService, contractExecutorService);
  }

  async openSwap(swapId: string, erc20Value: string, erc20ContractAddress: string, aeroValue: string, aeroTrader: string) {
    const openSwap = this.contract.methods.open(
      this.web3.utils.fromAscii(swapId),
      erc20Value,
      erc20ContractAddress,
      this.web3.utils.toWei(aeroValue, 'ether'),
      aeroTrader
    );
    const receipt = await this.contractExecutorService.send(openSwap);
    return receipt;
  }

  async closeSwap(swapId: string, ethValue: string) {
    const closeSwap = this.contract.methods.close(this.web3.utils.fromAscii(swapId));
    const receipt = await this.contractExecutorService.send(closeSwap, { value: ethValue });
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

  async checkSwapDetailed(swapId: string): Promise<Erc20ToAeroSwap> {
    const checkSwap = this.contract.methods.check(this.web3.utils.fromAscii(swapId));
    const response = await this.contractExecutorService.call(checkSwap);
    const token = await this.tokenService.getSaveTokensInfo(response.erc20ContractAddress);
    const swap: Erc20ToAeroSwap = {
      id: swapId,
      erc20Trader: response.erc20Trader,
      erc20Value: toNumber(response.erc20Value, token.decimals),
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
