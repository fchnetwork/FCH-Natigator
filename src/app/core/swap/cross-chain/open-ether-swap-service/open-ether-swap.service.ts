const artifacts = require('@core/abi/OpenAtomicSwapEther.json');

import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import { fromWei, fromAscii } from "web3-utils";

import { secondsToDate } from "@shared/helpers/date-util";
import { toBigNumberString } from "@shared/helpers/number-utils";
import { TransactionOptions } from "@core/ethereum/base-contract-service/transaction-options.model";
import { OpenEtherSwap } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.model";
import { BaseContractService } from "@core/ethereum/base-contract-service/base-contract.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";

@Injectable()
export class OpenEtherSwapService extends BaseContractService {

  constructor(
    notificationService: InternalNotificationService,
    ethereumAuthService: EthereumAuthenticationService,
    ethereumContractExecutorService: EthereumContractExecutorService,
    injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService
  ) {
    super(
      artifacts.abi,
      environment.contracts.swap.crossChain.address.ethereum.OpenEtherSwap,
      notificationService,
      ethereumAuthService,
      ethereumContractExecutorService,
      injectedWeb3ContractExecutorService
    );
  }

  async openSwap(hash: string, ethValue: string, withdrawTrader: string, timelock: number, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const openSwap = contract.methods.open(hash, withdrawTrader, toBigNumberString(timelock));
    const receipt = await this.send(openSwap, options, ethValue);
    return receipt;
  }

  async closeSwap(hash: string, secretKey: string, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const closeSwap = contract.methods.close(hash, fromAscii(secretKey));
    const receipt = await this.send(closeSwap, options);
    return receipt;
  }

  async expireSwap(hash: string, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const expireSwap = contract.methods.expire(hash);
    const receipt = await this.send(expireSwap, options);
    return receipt;
  }

  async checkSwap(hash: string): Promise<OpenEtherSwap> {
    const contract = await this.createContract();
    const checkSwap = contract.methods.check(hash);
    const response = await this.call(checkSwap);
    const swap: OpenEtherSwap = {
      hash,
      openTrader: response.openTrader,
      withdrawTrader: response.withdrawTrader,
      value: Number(fromWei(response.value, 'ether')),
      timelock: Number(response.timelock),
      openedOn: secondsToDate(Number(response.openedOn)),
      state: Number(response.state)
    };
    return swap;
  }

  async checkSecretKey(hash: string) {
    const contract = await this.createContract();
    const checkSecretKey = contract.methods.checkSecretKey(hash);
    const response = await this.call(checkSecretKey);
    return response;
  }

  async getAccountSwapIds(address: string): Promise<string[]> {
    const contract = await this.createContract();
    const getAccountSwaps = contract.methods.getAccountSwaps(address);
    const swapIds = await this.call(getAccountSwaps, address);
    return swapIds;
  }

}
