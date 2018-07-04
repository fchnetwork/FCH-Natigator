const artifacts = require('@core/abi/OpenAtomicSwapERC20.json');
const erc20ABI = require('@core/abi/tokens.ts');
import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import { secondsToDate } from "@shared/helpers/date-util";

import { toBigNumberString } from "@shared/helpers/number-utils";
import { TransactionOptions } from "@core/ethereum/base-contract-service/transaction-options.model";
import { BaseContractService } from "@core/ethereum/base-contract-service/base-contract.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { OpenErc20Swap } from "@core/swap/models/open-erc20-swap.model";

@Injectable()
export class OpenErc20SwapService extends BaseContractService {

  constructor(
    notificationService: InternalNotificationService,
    ethereumAuthService: EthereumAuthenticationService,
    ethereumContractExecutorService: EthereumContractExecutorService,
    injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService
  ) {
    super(
      artifacts.abi,
      environment.contracts.swap.crossChain.address.ethereum.OpenErc20Swap,
      notificationService,
      ethereumAuthService,
      ethereumContractExecutorService,
      injectedWeb3ContractExecutorService
    );
  }

  async openSwap(hash: string, erc20Value: string, erc20Address: string, withdrawTrader: string, timelock: number, options: TransactionOptions) {
    await this.tokenApprove(erc20Address, erc20Value, options);
    const contract = await this.createContract(options.wallet);
    const openSwap = contract.methods.open(hash, erc20Value, erc20Address, withdrawTrader, toBigNumberString(timelock));
    const receipt = await this.send(openSwap, options);
    return receipt;
  }

  private async tokenApprove(erc20Address: string, value: string, options: TransactionOptions) {
    const openErc20Swap = environment.contracts.swap.crossChain.address.ethereum.OpenErc20Swap as string;
    const web3 = await this.createWeb3(options.wallet);
    const tokenContract = new web3.eth.Contract(erc20ABI.tokensABI, erc20Address);
    const approve = tokenContract.methods.approve(openErc20Swap, value);
    await this.send(approve, { wallet: options.wallet, account: options.account });
  }

  async expireSwap(hash: string, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const expireSwap = contract.methods.expire(hash);
    const receipt = await this.send(expireSwap, options);
    return receipt;
  }

  async checkSwap(hash: string): Promise<OpenErc20Swap> {
    const contract = await this.createContract();
    const checkSwap = contract.methods.check(hash);
    const response = await this.call(checkSwap);
    const swap: OpenErc20Swap = {
      hash,
      openTrader: response.openTrader,
      withdrawTrader: response.withdrawTrader,
      erc20Value: response.erc20Value,
      erc20ContractAddress: response.erc20ContractAddress,
      timelock: response.timelock,
      openedOn: secondsToDate(Number(response.openedOn)),
      state: Number(response.state)
    };
    return swap;
  }
}

