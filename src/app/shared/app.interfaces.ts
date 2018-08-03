export interface selectedSeedPhrase {
    name: string;
    selected: boolean;
}

export interface iBlocks {
    "difficulty": number;
    "extraData": string;
    "gasLimit": number;
    "gasUsed": number;
    "hash": string;
    "logsBloom": string;
    "miner": string;
    "mixHash": string;
    "nonce": string;
    "number": number;
    "parentHash": string;
    "receiptsRoot": string;
    "sha3Uncles": string;
    "size": number;
    "stateRoot": string;
    "timestamp": number;
    "totalDifficulty": number;
    "transactions": [any];
    "transactionsRoot": string;
    "uncles": [any];
  }


  export interface iTransaction {
    "blockHash": string;
    "timestamp": number;
    "blockNumber":number;
    "from": string;
    "gas":number;
    "gasPrice": string;
    "hash": string;
    "input": string;
    "nonce": number;
    "to": string;
    "transactionIndex": number;
    "value": string;
    "v": string;
    "r": string;
    "s": string;
    "data": string;
  }



  export interface iPendingTxn {
    "blockHash": string;
    "from": string;
    "to": string;
    "gas": string;
    "gasPrice": string;
    "hash": string;
    "nonce": number;
    "transactionIndex": string;
    "value": string;
  }

  export enum TransactionStatus {
    PendingContract = 'Contract execution(pending)',
    Pending = 'Pending transaction',
    Successfull = 'Successful transaction',
    Failed = 'Failed transaction'
  }

  export interface iToken {
    "address": string,
    "symbol": string,
    "decimals": string,
    "balance": string
  }

  export interface iFullBackup {
    'aerum_base': string,
    'aerum_keyStore': string,
    'tokens': string,
    'ethereum_tokens': string,
    'transactions': string,
    'settings': string,
    'ethereum_accounts': string,
    'cross_chain_swaps': string
  }

  export interface iSettings {
    generalSettings: iGeneralSettings,
    transactionSettings: iTransactionSettings,
    systemSettings: iSystemSettings
  }

  export interface iGeneralSettings {
    language: string;
    derivationPath: string;
    numberOfBlocks: number;
  }

  export interface iTransactionSettings {
    gasPrice: string;
    maxTransactionGas:string;
    lastTransactionsNumber: string;
  }

  export interface iSystemSettings {
    aerumNodeWsURI: string;
    aerumNodeRpcURI: string;
    ethereumNodeURI: string;
  }
