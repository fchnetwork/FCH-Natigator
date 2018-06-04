import { Injectable } from "@angular/core";

import Web3 from 'web3';
import { Tx, TransactionObject, TransactionReceipt } from 'web3/types';

import { LoggerService } from '@core/general/logger-service/logger.service';
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";

@Injectable()
export class InjectedWeb3ContractExecutorService {

  private readonly contractGasThreshold = 100 * 1000;

  private currentWalletAddress: string;
  private web3: Web3;

  constructor(
    private logger: LoggerService,
    private ethereumAuthService: EthereumAuthenticationService
  ) {
    ethereumAuthService.getInjectedWeb3().then(async (w3) => {
      this.web3 = w3;
      const accounts = await this.web3.eth.getAccounts();
      this.logger.logMessage("Web3 account: " + accounts[0]);
      this.currentWalletAddress = accounts[0];
    });
  }

  async send(transaction: TransactionObject<any>, options: { value: string } = { value: '0' }) : Promise<TransactionReceipt> {
    const tx = await this.createSendTx(transaction, options);
    this.logger.logMessage('Transaction being sent');
    const receipt = await transaction.send(tx);
    return receipt;
  }

  async call(transaction: TransactionObject<any>) {
    const tx = this.createCallTx(transaction);
    const response = await transaction.call(tx);
    return response.valueOf();
  }

  private async createSendTx(transaction: TransactionObject<any>, options: { value: string } = { value: '0' }) : Promise<Tx> {
    const aeroValueInWei = this.web3.utils.toWei(options.value, 'ether');
    const [gasPrice, estimatedGas, transactionsCount] = await this.getSentTxData(transaction, options);

    this.logger.logMessage(`Transaction estimated gas: ${estimatedGas}`);
    return {
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.currentWalletAddress,
      value: this.web3.utils.toHex(aeroValueInWei),
      gasPrice: this.web3.utils.toHex(gasPrice),
      gas: this.web3.utils.toHex(estimatedGas + this.contractGasThreshold),
      nonce: this.web3.utils.toHex(transactionsCount),
      data: transaction.encodeABI()
    };
  }

  private async getSentTxData(transaction: TransactionObject<any>, options: { value: string } = { value: '0' }) : Promise<[number, number, number]> {
    const aeroValueInWei = this.web3.utils.toWei(options.value, 'ether');

    const getGasPrice = this.web3.eth.getGasPrice();
    const getTransactionsCount = this.web3.eth.getTransactionCount(this.currentWalletAddress);
    const getEstimatedGas = transaction.estimateGas({
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.currentWalletAddress,
      value: this.web3.utils.toHex(aeroValueInWei),
      data: transaction.encodeABI()
    });

    const [gasPrice, estimatedGas, transactionsCount] = await Promise.all([getGasPrice, getEstimatedGas, getTransactionsCount]);
    return [gasPrice, estimatedGas, transactionsCount];
  }

  async estimateCost(transaction: TransactionObject<any>, options: { value: string } = { value: '0' }) : Promise<[number, number, number]> {
    const aeroValueInWei = this.web3.utils.toWei(options.value, 'ether');

    const getGasPrice = this.web3.eth.getGasPrice();
    const getEstimatedGas = transaction.estimateGas({
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.currentWalletAddress,
      value: this.web3.utils.toHex(aeroValueInWei),
      data: transaction.encodeABI()
    });

    const [gasPrice, estimatedGas] = await Promise.all([getGasPrice, getEstimatedGas]);
    return [gasPrice, estimatedGas, estimatedGas + this.contractGasThreshold];
  }

  private createCallTx(transaction: TransactionObject<any>) : Tx {
    return {
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.currentWalletAddress,
      data: transaction.encodeABI()
    };
  }
}
