import { Injectable } from '@angular/core';

import { tokensABI } from '@app/core/abi/tokens';
import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { BaseContractService } from "@core/ethereum/base-contract-service/base-contract.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";

@Injectable()
export class EthereumTokenService extends BaseContractService {

  constructor(
    notificationService: InternalNotificationService,
    ethereumAuthService: EthereumAuthenticationService,
    ethereumContractExecutorService: EthereumContractExecutorService,
    injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService
  ) {
    super(
      tokensABI,
      null,
      notificationService,
      ethereumAuthService,
      ethereumContractExecutorService,
      injectedWeb3ContractExecutorService
    );
  }

  async getBalanceOf(wallet = EthWalletType.Imported, address: string, account: string): Promise<number> {
    const contract = await this.createContractByAddress(wallet, address);

    const tokenBalanceOf = this.call(contract.methods.balanceOf(account));
    const tokenDecimals = this.call(contract.methods.decimals());
    const [balance, decimals] = await Promise.all([tokenBalanceOf, tokenDecimals]);

    return balance / Math.pow(10, decimals);
  }

}
