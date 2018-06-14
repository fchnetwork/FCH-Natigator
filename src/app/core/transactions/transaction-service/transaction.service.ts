import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import * as Moment from 'moment';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SessionStorageService } from 'ngx-webstorage';
import { tokensABI } from '@app/core/abi/tokens';
import { environment } from '@env/environment';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { TokenService } from '@core/transactions/token-service/token.service';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';

const Tx = require('ethereumjs-tx');
const ethJsUtil = require('ethereumjs-util');

@Injectable()
export class TransactionService {

    // if moving or renaming be sure to update the convertToEther pipe in shared modules
    web3: any;

    constructor(
      _auth: AuthenticationService,
      private sessionStorage: SessionStorageService,
      private modalService: ModalService,
      private tokenService: TokenService,
      private notificationMessagesService: NotificationMessagesService
     ) {
      this.web3 = _auth.initWeb3();
    }

    /**
     * @desc outputs the users balance then converts to ether balance
     * @param account
     */
    checkBalance(account?:string) {
      return   this.web3.eth.getBalance(account).then( balance => {
        return this.web3.utils.fromWei( balance.toString(), 'ether');
       });
    }

    // If moving this function be sure to update the convertToEther pipe in shared modules
    convertToEther(amount) : string {
      return this.web3.utils.fromWei( amount.toString(), 'ether');
    }

    generateContract(contractAddress) {
      const tokensContract = new this.web3.eth.Contract(tokensABI, contractAddress, {gas: 10000000});
      return tokensContract;
    }

    maxTransactionFee(to, data) {
      if(data.type === 'token') {
        const tokensContract = this.generateContract(data.contractAddress);
        data = tokensContract.methods.transfer(to, data.amount).encodeABI();
      }
      return new Promise((resolve, reject) => {
        const sendTo = ethJsUtil.toChecksumAddress( to );
        const txData = this.web3.utils.asciiToHex( data );
        const estimateGas = this.web3.eth.estimateGas({to:sendTo, data:txData});
        const gasPrice = this.web3.eth.getGasPrice();

        Promise.all([gasPrice, estimateGas]).then((res) =>{
          const price = Number(this.web3.utils.fromWei(String(res[0]), 'gwei'));
          const transactionFee = Number(this.web3.utils.toWei(String(1), 'gwei')) * Number(res[1]);
          const resultInGwei = this.web3.utils.fromWei(String(transactionFee), 'gwei');
          const resultInEther = this.web3.utils.fromWei(String(transactionFee), 'ether');
          resolve([resultInGwei, resultInEther, price, res[1]]);
        }).catch((err)=>{
          const transactionFee = Number(this.web3.utils.toWei(String(1), 'gwei')) * Number(1000000);
           const resultInGwei = this.web3.utils.fromWei(String(transactionFee), 'gwei');
           const resultInEther = this.web3.utils.fromWei(String(transactionFee), 'ether');
           resolve([resultInGwei, resultInEther, 1000000, 1000000]);
        });
      });
    }

    saveTransaction(from, to, amount, data, hash, type, tokenName, decimals) {
      const date = new Date();
      let transaction;
      if(tokenName && decimals) {
        transaction = { from, to, amount, data, date, hash, type, tokenName, decimals };
      } else {
        transaction = { from, to, amount, data, date, hash, type };
      }
      const transactions = this.sessionStorage.retrieve('transactions') || [];
      transactions.push(transaction);
      this.updateStorage(transactions);
    }

    updateStorage(transactions) {
      const password = this.sessionStorage.retrieve('password');
      const stringTransaction = JSON.stringify(transactions);
      const encryptedTransactions = CryptoJS.AES.encrypt( stringTransaction, password );
      Cookie.set('transactions', encryptedTransactions, 7, "/", environment.cookiesDomain);
      this.sessionStorage.store('transactions', transactions);
    }

   async updateTransactionsStatuses(transactions) {
        const sortedTransactions = [];
        for(let i = 0; i < transactions.length; i++) {
          const receipt = await this.web3.eth.getTransactionReceipt( transactions[i].hash );
          if(receipt) {
            if(receipt.status) {
              if(transactions[i].data === 'Contract execution(pending)') {
                this.notificationMessagesService.transactionMinedNotification(transactions[i].hash);
                const tokenInfo = await this.tokenService.getTokensInfo(receipt.to);
                const tokenName = transactions[i].tokenName || tokenInfo.symbol;
                transactions[i].data = `Sent ${tokenName} tokens`;
                const value: any = await this.tokenService.getTokenTransactionValue(receipt.to, receipt.blockNumber);
                transactions[i].amount = Number(value / Math.pow(10, transactions[i].decimals));
                transactions[i].type = tokenName;
                this.notificationMessagesService.succefullSentNotification(transactions[i].hash);
              } else if (transactions[i].data === 'Pending transaction') {
                this.notificationMessagesService.transactionMinedNotification(transactions[i].hash);
                transactions[i].data = 'Successful transaction';
                this.notificationMessagesService.succefullSentNotification(transactions[i].hash);
              }
              sortedTransactions.push(transactions[i]);
            } else  {
              if(transactions[i].data === 'Contract execution(pending)') {
                transactions[i].data = 'Failed contract execution';
              } else if (transactions[i].data === 'Pending transaction') {
                transactions[i].data = 'Failed transaction';
              }
              sortedTransactions.push(transactions[i]);
            }

            if(i + 1 === transactions.length) {
              this.updateStorage(sortedTransactions);
            }
          } else {
            sortedTransactions.push(transactions[i]);

            if(i + 1 === transactions.length) {
              this.updateStorage(sortedTransactions);
            }
          }
        }
    }

    transaction( privkey, activeUser, to, amount, data, external, urls, orderId, moreOptionsData ) : Promise<any> {
      return new Promise( (resolve, reject) => {
          const privateKey          = ethJsUtil.toBuffer( privkey )
          const sendTo              = ethJsUtil.toChecksumAddress( to ) ;
          const from                = ethJsUtil.toChecksumAddress( activeUser );
          const txValue             = this.web3.utils.numberToHex(this.web3.utils.toWei( amount.toString(), 'ether'));
          const txData              = this.web3.utils.asciiToHex( data );
          const getGasPrice         = this.web3.eth.getGasPrice();
          const getTransactionCount = this.web3.eth.getTransactionCount( from )
          const estimateGas         = this.web3.eth.estimateGas({to:sendTo, data:txData});

          return Promise.all([getGasPrice, getTransactionCount, estimateGas]).then( (values) => {
            const gasPrice = values[0];
            const nonce = parseInt(values[1], 10);
            const gas = parseInt(values[2], 10);
            const rawTransaction:any = {
              nonce: this.web3.utils.toHex( nonce ),
              gas: this.web3.utils.toHex( gas ),
              // TODO: export it to any config and import from there
              gasPrice: this.web3.utils.toHex( this.web3.utils.toWei( environment.gasPrice, 'gwei')),
              to,
              value: txValue,
              data: txData,
            };

            if(moreOptionsData.gasLimit) {
              rawTransaction.gasLimit = moreOptionsData.gasLimit;
            }

            const tx = new Tx(rawTransaction);
                  tx.sign(privateKey);
            const transaction = this.web3.eth.sendSignedTransaction( ethJsUtil.addHexPrefix( tx.serialize().toString('hex') ) );
                transaction.on('transactionHash', hash => {
                  this.saveTransaction(activeUser, to, amount, 'Pending transaction', hash, 'Aero', null, null);
                  this.web3.eth.getTransaction(hash).then((res)=>{
                    res.timestamp = Moment(new Date()).unix();
                    if(external) {
                      window.location.href = urls.success;
                    } else {
                      this.notificationMessagesService.pendingTransactionNotification(hash);
                    }
                  });
                }).catch( error => {
                  console.log(error);
                  if(external) {
                    window.location.href=urls.failed;
                  } else {
                    this.notificationMessagesService.failedTransactionNotification();
                  }
                    // alert( error )
                });
          });
      });
    }

    async sendTokens(myAddress, to, amount, contractAddress, external, urls, orderId, tokenName, decimals) {
      const count = await this.web3.eth.getTransactionCount(myAddress);
      const tokensContract = new this.web3.eth.Contract(tokensABI, contractAddress, { from: myAddress, gas: 4000000});

      const gasPrice = await this.web3.eth.getGasPrice();
      const rawTransaction = {
        "from": myAddress,
        "nonce": this.web3.utils.toHex( count ),
        "gasPrice": this.web3.utils.toHex(gasPrice) || "0x003B9ACA00",
        "gasLimit": "0x250CA",
        "to": contractAddress,
        "value": "0x0",
        "data": tokensContract.methods.transfer(to, amount).encodeABI(),
      };
      const privKey = this.sessionStorage.retrieve('private_key');
      const privateKey = ethJsUtil.toBuffer( privKey );
      const tx = new Tx(rawTransaction);
      tx.sign(privateKey);

      const transaction = this.web3.eth.sendSignedTransaction( ethJsUtil.addHexPrefix( tx.serialize().toString('hex') ) );
      transaction.on('transactionHash', hash => {
        this.web3.eth.getTransaction(hash).then((res)=>{
          this.saveTransaction(myAddress, to, 0, 'Contract execution(pending)', hash, 'token', tokenName, decimals);
          this.web3.eth.getTransaction(hash).then((res)=>{
            res.timestamp = Moment(new Date()).unix();
            if(external) {
              window.location.href = urls.success;
            } else {
              this.notificationMessagesService.pendingTransactionNotification(hash);
            }
          });
        });
      }).catch( error => {
        console.log(error);
        if(external) {
          window.location.href = urls.failed;
        } else {
          this.notificationMessagesService.failedTransactionNotification();
        }
          // alert( error )
      });
    }

    checkAddressCode(address) {
      return new Promise((resolve, reject)=>{
        this.web3.eth.getCode(address).then((res)=>{
          resolve(res);
        }).catch((err)=>{
          reject(err);
        });
      });
    }


}
