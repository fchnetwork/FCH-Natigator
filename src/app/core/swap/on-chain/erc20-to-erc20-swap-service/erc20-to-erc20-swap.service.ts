const artifacts = require('@core/abi/AtomicSwapERC20ToERC20.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { fromSolidityDecimalString } from "@shared/helpers/number-utils";
import { secondsToDate } from "@shared/helpers/date-util";

import { TokenService } from "@core/transactions/token-service/token.service";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";
import { Erc20ToErc20Swap } from "@core/swap/on-chain/erc20-to-erc20-swap-service/erc20-to-erc20-swap.model";

@Injectable()
export class Erc20ToErc20SwapService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService,
    private tokenService: TokenService
  ) {
    super(artifacts.abi, environment.contracts.swap.address.Erc20ToErc20, authenticationService, contractExecutorService);
  }

  async openSwap(swapId: string, openValue: string, openContractAddress: string, closeValue: string, closeTrader: string, closeContractAddress: string) {
    const openSwap = this.contract.methods.open(
      this.web3.utils.fromAscii(swapId),
      openValue,
      openContractAddress,
      closeValue,
      closeTrader,
      closeContractAddress
    );
    const receipt = await this.contractExecutorService.send(openSwap);
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

  async checkSwapDetailed(swapId: string): Promise<Erc20ToErc20Swap> {
    const checkSwap = this.contract.methods.check(this.web3.utils.fromAscii(swapId));
    const response = await this.contractExecutorService.call(checkSwap);
    const [openToken, closeToken] = await Promise.all([
      this.tokenService.getSaveTokensInfo(response.openContractAddress),
      this.tokenService.getSaveTokensInfo(response.closeContractAddress)
    ]);
    const swap: Erc20ToErc20Swap = {
      id: swapId,
      openTrader: response.openTrader,
      openValue: fromSolidityDecimalString(response.openValue, openToken.decimals),
      openToken,
      closeTrader: response.closeTrader,
      closeValue: fromSolidityDecimalString(response.closeValue, closeToken.decimals),
      closeToken,
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
