import { TransactionObject, TransactionReceipt } from "web3/types";

import Web3 from "web3";
import { TransactionOptions } from "@core/contract/contract-executor-service/transaction-options.model";

export interface ContractExecutorService {
  init(web3: Web3, account: string, privateKey: string): void;
  call(transaction: TransactionObject<any>): any;
  send(transaction: TransactionObject<any>, options?: TransactionOptions): Promise<TransactionReceipt>;
  estimateCost(transaction: TransactionObject<any>, options?: TransactionOptions):  Promise<[number, number, number]>;
  getWeb3(): Web3;
}
