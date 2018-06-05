import { TransactionObject, TransactionReceipt } from "web3/types";
import Web3 from "web3";

export interface ContractExecutorService {
  init(web3: Web3, account: string, privateKey: string): void;
  call(transaction: TransactionObject<any>): any;
  send(transaction: TransactionObject<any>, options?: { value: string }): Promise<TransactionReceipt>;
  estimateCost(transaction: TransactionObject<any>, options?: { value: string }):  Promise<[number, number, number]>;
}
