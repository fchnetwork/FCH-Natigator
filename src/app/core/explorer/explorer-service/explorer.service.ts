import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import 'rxjs/Rx';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { environment } from '@env/environment';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { LoaderService } from '@app/core/general/loader-service/loader.service';
import { BlockListModel } from '@app/core/explorer/explorer-service/blocks-list.model';
import { iTransaction, iBlocks } from '@app/shared/app.interfaces';
import { TransactionListModel } from '@app/core/explorer/explorer-service/transaction-list.model';

const ethJsUtil = require('ethereumjs-util');
const Web3 = require('web3');


@Injectable()
export class ExplorerService {

  web3: any;
  account: any;
  txpoolContentData = { "jsonrpc": "2.0", "method": "txpool_content", "params": [], "id": 1 }
  txpoolInspectData = { "jsonrpc": "2.0", "method": "txpool_inspect", "params": [], "id": 1 }

  constructor(private _http: Http, _auth: AuthenticationService, public loaderService: LoaderService) {
    this.web3 = _auth.initWeb3();
    this.account = JSON.parse(Cookie.get('account'));
  }

  fromWei(amountInWei, currency) {
    return this.web3.utils.fromWei(amountInWei.toString(), currency);
  }

  getPendingTransactions() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http
      .post(environment.HttpProvider, this.txpoolContentData, options)
      .map(response => response.json().result.pending);
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
            for(let txn of currentBlock.transactions) {
              let extendedTxn = Object.assign(txn, { timestamp: currentBlock.timestamp, gasUsedinTxn: currentBlock.gasUsed, block: currentBlock });
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
