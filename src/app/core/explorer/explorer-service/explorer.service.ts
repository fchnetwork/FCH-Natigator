import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/Rx';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { environment } from '@env/environment';
import { AuthenticationService } from '@core/authentication/authentication-service/authentication.service';
import { BlockListModel } from '@core/explorer/explorer-service/blocks-list.model';
import { TransactionListModel } from '@core/explorer/explorer-service/transaction-list.model';
import { iTransaction, iPendingTxn } from "@shared/app.interfaces";

@Injectable()
export class ExplorerService {

  web3: any;
  account: any;
  txpoolContent = {
    property: 'txpool',
    methods: [{
      name: 'content',
      call: 'txpool_content'
    },{
      name: 'inspect',
      call: 'txpool_inspect'
    },{
      name: 'status',
      call: 'txpool_status'
    }]
  };

  constructor(private _http: Http, _auth: AuthenticationService) {
    this.web3 = _auth.initWeb3();
    this.account = JSON.parse(Cookie.get('account'));
  }

  fromWei(amountInWei, currency) {
    return this.web3.utils.fromWei(amountInWei.toString(), currency);
  }

  getPendingTransactions(): Promise<iPendingTxn[]> {
    this.web3.extend(this.txpoolContent);

    return new Promise<iPendingTxn[]>((resolve, reject) => {
      this.web3.txpool.content()
      .then(res => {
        resolve(res.pending);
      });
    });
  }

  /**
   * Returns the number of the last block.
   *
   * @returns {Observable<number>} Number of the last block.
   * @memberof ExplorerService
   */
  getLatestBlockNumber(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      return this.web3.eth.getBlockNumber((err, block) => {
        if (err != null) {
          reject();
        }
        resolve(block);
      });
    });
  }



  /**
   * Returns blocks from the blockchain in specified range.
   *
   * @param {number} topBlockNumber Initial block number from which the blocks are being retireved.
   * @param {number} pageSize Ammount of blocks to retrieve.
   * @returns {Observable<BlockListModel>} Returns an array of blocks, the highest and the lowest block number encapsulated in BlockListModel.
   * @memberof ExplorerService
   */
  getBlocks(topBlockNumber: number, pageSize: number): Promise<BlockListModel> {
    return new Promise<BlockListModel>((resolve, reject) => {
      let blocks = [];

      for (var i = 0; i < pageSize; ++i) {
        this.web3.eth.getBlock(topBlockNumber - i, true, (error, result) => {
          if (!error) {
            blocks.push(result);
          }

          // Check if it's the last block
          if (result.number == topBlockNumber - pageSize + 1) {
            let lowBlock = blocks[0].number;
            let highBlock = blocks[blocks.length - 1].number;

            blocks.sort((a, b): number => {
              if (a.number > b.number) return 1;
              if (a.number < b.number) return -1;
            });

            blocks.reverse();

            resolve({
              blocks: blocks,
              lowBlock: lowBlock,
              highBlock: highBlock
            });
          }
        });
      }
    });
  }

  /**
   * Returns transaction by hash.
   *
   * @param {number} transactionHash Transaction hash to look for
   * @returns {Promise<iTransaction>} Returns an promise with all information about transaction
   * @memberof ExplorerService
   */
  getTransactionByHash(transactionHash: number): Promise<iTransaction> {
    return new Promise<iTransaction>((resolve, reject) => {
      this.web3.eth.getTransaction(transactionHash)
        .then(txn => {
          if (txn.blockNumber) {
            this.getBlocks(txn.blockNumber, 1).then(blocks => {
              let currentBlock = blocks.blocks[0];
              let extendedTxn = Object.assign(txn, { timestamp: currentBlock.timestamp, gasUsedinTxn: currentBlock.gasUsed })
              resolve(extendedTxn);
            })
          }
        });
    });
  }

  /**
   * Retrieves transactions from the specified range of blocks.
   *
   * @param {number} topBlockNumber Initial block number from which the transactions are being retireved.
   * @param {number} pageSize Ammount of blocks to scan for transactions.
   * @returns {Promise<TransactionListModel>}
   * @memberof ExplorerService
   */
  getTransactions(topBlockNumber: number, pageSize: number): Promise<TransactionListModel> {
    return new Promise<TransactionListModel>((resolve, reject) => {
      this.getBlocks(topBlockNumber, pageSize).then(blockList => {
        let completeTransactionList = [];

        for (let i = 0; i < blockList.blocks.length; i++) {
          let currentBlock = blockList.blocks[i];

          if (currentBlock.transactions.length > 0) {
            for (let txn of currentBlock.transactions) {
              let extendedTxn = Object.assign(txn, { timestamp: currentBlock.timestamp, gasUsedinTxn: txn.gas, block: currentBlock });
            }

            completeTransactionList = completeTransactionList.concat(blockList.blocks[i].transactions)
          }
        }

        resolve({
          transactions: completeTransactionList,
          highBlock: blockList.highBlock,
          lowBlock: blockList.lowBlock
        });
      });
    });
  }
}
