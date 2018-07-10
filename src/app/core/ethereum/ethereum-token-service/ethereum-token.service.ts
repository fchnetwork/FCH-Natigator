import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

import { tokensABI } from '@app/core/abi/tokens';
import { safePromise } from "@app/shared/helpers/promise-utils";
import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { Token } from "@core/transactions/token-service/token.model";
import { BaseContractService } from "@core/ethereum/base-contract-service/base-contract.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { TokenStorageService } from "@core/transactions/token-storage-service/token-storage.service";

@Injectable()
export class EthereumTokenService extends BaseContractService {

  private tokenStorageService: TokenStorageService;

  constructor(
    notificationService: InternalNotificationService,
    ethereumAuthService: EthereumAuthenticationService,
    ethereumContractExecutorService: EthereumContractExecutorService,
    injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService,
    sessionStorage: SessionStorageService
  ) {
    super(
      tokensABI,
      null,
      notificationService,
      ethereumAuthService,
      ethereumContractExecutorService,
      injectedWeb3ContractExecutorService
    );
    this.tokenStorageService = new TokenStorageService("ethereum-tokens", sessionStorage);
  }

  getTokens(includeEth?: boolean): Token[] {
    const tokens = [];
    if(includeEth){
      tokens.push({
        symbol: 'ETH',
        address: '0x0'
      });
    }
    return tokens.concat(this.tokenStorageService.getTokens());
  }

  addToken(token: Token) {
    return this.tokenStorageService.addToken(token);
  }

  deleteToken(token: Token) {
    return this.tokenStorageService.deleteToken(token);
  }

  saveTokens(tokens: Token[]) {
    return this.tokenStorageService.saveTokens(tokens);
  }

  getLocalTokenInfo(address: string): Token {
    return this.tokenStorageService.getLocalTokenInfo(address);
  }

  async getBalance(wallet = EthWalletType.Imported, contractAddress: string, account: string): Promise<number> {
    const contract = await this.createContractByAddress(wallet, contractAddress);
    const tokenBalanceOf = this.call(contract.methods.balanceOf(account));
    const tokenDecimals = this.call(contract.methods.decimals());
    const [balance, decimals] = await Promise.all([
      safePromise(tokenBalanceOf, 0),
      safePromise(tokenDecimals, 0)
    ]);
    return balance / Math.pow(10, decimals);
  }

  async isAddress(wallet = EthWalletType.Imported, contractAddress: string): Promise<boolean> {
    const web3 =  await this.createWeb3(wallet);
    return web3.utils.isAddress(contractAddress);
  }

  async getNetworkTokenInfo(wallet = EthWalletType.Imported, contractAddress: string, account: string): Promise<Token> {
    if (!(await this.isAddress(wallet, contractAddress))) {
      throw new Error('Address is not valid');
    }

    const contract = await this.createContractByAddress(wallet, contractAddress);
    const tokenSymbol = this.call(contract.methods.symbol());
    const tokenDecimals = this.call(contract.methods.decimals());
    const tokenTotalSupply = this.call(contract.methods.totalSupply());
    const tokenBalanceOf = this.call(contract.methods.balanceOf(account));

    const [symbol, decimals, totalSupply, balance] = await Promise.all([
      safePromise(tokenSymbol, null),
      safePromise(tokenDecimals, 0),
      safePromise(tokenTotalSupply, 0),
      safePromise(tokenBalanceOf, 0)
    ]);

    const decimalsNumber = Number(decimals) || 0;
    const token: Token = {
      address: contractAddress,
      symbol: symbol || null,
      decimals: decimalsNumber,
      totalSupply: Number(totalSupply) || 0,
      balance: (Number(balance) || 0) / Math.pow(10, Number(decimalsNumber))
    };

    return token;
  }

}
