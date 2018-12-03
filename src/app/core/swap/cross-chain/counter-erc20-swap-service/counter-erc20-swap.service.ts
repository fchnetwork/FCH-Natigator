const artifacts = require('@core/abi/CounterAtomicSwapERC20.json');

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from "@env/environment";
import { fromAscii } from "web3-utils";

import { BaseContractService } from "@core/ethereum/base-contract-service/base-contract.service";
import { TransactionOptions } from "@core/ethereum/base-contract-service/transaction-options.model";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { CounterErc20Swap } from "@core/swap/models/counter-erc20-swap.model";

@Injectable()
export class CounterErc20SwapService extends BaseContractService {

  constructor(
    notificationService: InternalNotificationService,
    ethereumAuthService: EthereumAuthenticationService,
    ethereumContractExecutorService: EthereumContractExecutorService,
    injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService,
    translateService: TranslateService
  ) {
    super(
      artifacts.abi,
      environment.contracts.swap.crossChain.address.ethereum.CounterErc20Swap,
      notificationService,
      ethereumAuthService,
      ethereumContractExecutorService,
      injectedWeb3ContractExecutorService,
      translateService
    );
  }

  /**
   * Closes a swap
   * @param {string} hash - hash of the swap
   * @param {string} secretKey - key to validate if you are an owner of the swap
   * @param {TransactionOptions} options - options for web3 contract method call
   */
  async closeSwap(hash: string, secretKey: string, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const closeSwap = contract.methods.close(hash, fromAscii(secretKey));
    const receipt = await this.send(closeSwap, options);
    return receipt;
  }

  /**
   * Checks and returns an information about swap
   * @param {string} hash - hash of the swap
   * @param {TransactionOptions} options - options for web3 contract method call
   * @return {CounterErc20Swap} Swap object
   */
  async checkSwap(hash: string, options: TransactionOptions): Promise<CounterErc20Swap> {
    const contract = await this.createContract(options.wallet);
    const checkSwap = contract.methods.check(hash);
    const response = await this.call(checkSwap);
    const swap: CounterErc20Swap = {
      hash,
      erc20Value: response.erc20Value,
      erc20ContractAddress: response.erc20ContractAddress,
      openTrader: response.openTrader,
      withdrawTrader: response.openTrader,
      state: response.state,
      timelock: response.timelock
    };
    return swap;
  }
}
