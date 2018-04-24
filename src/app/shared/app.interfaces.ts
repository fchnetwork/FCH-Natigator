export interface selectedSeedPhrase {
    name: string;
    selected: boolean;
}

export interface iBlocks {
    "difficulty": string;
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
    "timestamp": 1520373465;
    "totalDifficulty": "102723";
    "transactions": [any];
    "transactionsRoot": string;
    "uncles": [any];
  }

  


  export interface iTransaction {
    "blockHash": string;
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