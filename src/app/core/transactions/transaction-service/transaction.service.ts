import { Injectable } from "@angular/core";
import * as Moment from "moment";
import { tokensABI } from "@app/core/abi/tokens";
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { ModalService } from "@app/core/general/modal-service/modal.service";
import { TokenService } from "@core/transactions/token-service/token.service";
import { NotificationMessagesService } from "@core/general/notification-messages-service/notification-messages.service";
import { ActivatedRoute, Router, Params } from '@angular/router';

import { SettingsService } from "@app/core/settings/settings.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { EnvironmentService } from "@core/general/environment-service/environment.service";

const Tx = require("ethereumjs-tx");
const ethJsUtil = require("ethereumjs-util");
const ethWallet = require("ethereumjs-wallet");

@Injectable()
export class TransactionService {
  // if moving or renaming be sure to update the convertToEther pipe in shared modules
  web3: any;

  constructor(
    _auth: AuthenticationService,
    private logger: LoggerService,
    private modalService: ModalService,
    private tokenService: TokenService,
    private notificationMessagesService: NotificationMessagesService,
    private settingsService: SettingsService,
    private storageService: StorageService,
    private router: Router,
    private environment: EnvironmentService
  ) {
    this.web3 = _auth.getWeb3();
  }

  /**
   * @desc outputs the users balance then converts to ether balance
   * @param account
   */
  checkBalance(account?: string) {
    return this.web3.eth.getBalance(account).then(balance => {
      return this.web3.utils.fromWei(balance.toString(), "ether");
    });
  }

  async checkBalanceOfPrivateKey(privateKey: string): Promise<number> {
      const privateKeyBuffer = Buffer.from(privateKey, "hex");
      const wallet = ethWallet.fromPrivateKey(privateKeyBuffer);
      const address = wallet.getChecksumAddressString();
      const balance = await this.checkBalance(address);
      return Number(balance);
  }

  // If moving this function be sure to update the convertToEther pipe in shared modules
  convertToEther(amount): string {
    return this.web3.utils.fromWei(amount.toString(), "ether");
  }

  generateContract(contractAddress) {
    const tokensContract = new this.web3.eth.Contract(
      tokensABI,
      contractAddress,
      {
        gas: this.settingsService.settings.transactionSettings.maxTransactionGas
      }
    );
    return tokensContract;
  }

  maxTransactionFee(to, data) {
    if (data.type === "token") {
      const tokensContract = this.generateContract(data.contractAddress);
      data = tokensContract.methods.transfer(to, data.amount).encodeABI();
    }
    return new Promise((resolve, reject) => {
      const sendTo = ethJsUtil.toChecksumAddress(to);
      const txData = this.web3.utils.asciiToHex(data);
      const estimateGas = this.web3.eth.estimateGas({
        to: sendTo,
        data: txData
      });
      const gasPrice = this.web3.eth.getGasPrice();

      Promise.all([gasPrice, estimateGas])
        .then(res => {
          const price = Number(this.web3.utils.fromWei(String(res[0]), "gwei"));
          const transactionFee =
            Number(
              this.web3.utils.toWei(
                this.settingsService.settings.transactionSettings.gasPrice,
                "gwei"
              )
            ) * Number(res[1]);
          const resultInGwei = this.web3.utils.fromWei(
            String(transactionFee),
            "gwei"
          );
          const resultInEther = this.web3.utils.fromWei(
            String(transactionFee),
            "ether"
          );
          resolve([resultInGwei, resultInEther, price, res[1]]);
        })
        .catch(err => {
          const transactionFee =
            Number(
              this.web3.utils.toWei(
                this.settingsService.settings.transactionSettings.gasPrice,
                "gwei"
              )
            ) *
            Number(
              this.settingsService.settings.transactionSettings
                .maxTransactionGas
            );
          const resultInGwei = this.web3.utils.fromWei(
            String(transactionFee),
            "gwei"
          );
          const resultInEther = this.web3.utils.fromWei(
            String(transactionFee),
            "ether"
          );
          resolve([
            resultInGwei,
            resultInEther,
            this.settingsService.settings.transactionSettings.maxTransactionGas,
            this.settingsService.settings.transactionSettings.maxTransactionGas
          ]);
        });
    });
  }

  saveTransaction(from, to, amount, data, hash, type, tokenName, decimals) {
    const date = new Date();
    let transaction;
    transaction = {
      from,
      to,
      amount,
      data,
      date,
      hash,
      type,
      tokenName,
      decimals
    };
    const transactions =
      this.storageService.getSessionData("transactions") || [];
    transactions.push(transaction);
    this.updateStorage(transactions);
  }

  updateStorage(transactions) {
    this.storageService.setSessionData("transactions", transactions);
  }

  async updateTransactionsStatuses(transactions) {
    const sortedTransactions = [];
    for (let i = 0; i < transactions.length; i++) {
      const receipt = await this.web3.eth.getTransactionReceipt(
        transactions[i].hash
      );
      if (receipt) {
        if (receipt.status) {
          if (transactions[i].data === "Contract execution(pending)") {
            this.notificationMessagesService.transactionMinedNotification(
              transactions[i].hash
            );
            const tokenInfo = await this.tokenService.getTokensInfo(receipt.to);
            const tokenName = transactions[i].tokenName || tokenInfo.symbol;
            transactions[i].data = `Sent ${tokenName} tokens`;
            const value: any = await this.tokenService.getTokenTransactionValue(
              receipt.to,
              receipt.blockNumber
            );
            transactions[i].amount = Number(
              value / Math.pow(10, transactions[i].decimals)
            );
            transactions[i].type = tokenName;
            this.notificationMessagesService.succefullSentNotification(
              transactions[i].hash
            );
          } else if (transactions[i].data === "Pending transaction") {
            this.notificationMessagesService.transactionMinedNotification(
              transactions[i].hash
            );
            transactions[i].data = "Successful transaction";
            this.notificationMessagesService.succefullSentNotification(
              transactions[i].hash
            );
          }
          sortedTransactions.push(transactions[i]);
        } else {
          if (transactions[i].data === "Contract execution(pending)") {
            transactions[i].data = "Failed contract execution";
          } else if (transactions[i].data === "Pending transaction") {
            transactions[i].data = "Failed transaction";
          }
          sortedTransactions.push(transactions[i]);
        }

        if (i + 1 === transactions.length) {
          this.updateStorage(sortedTransactions);
        }
      } else {
        sortedTransactions.push(transactions[i]);

        if (i + 1 === transactions.length) {
          this.updateStorage(sortedTransactions);
        }
      }
    }
  }

  // TODO: Refactor this method to async / await as it becomes really complicated
  transaction(
    privkey: string,
    activeUser,
    to,
    amount,
    data,
    external,
    urls,
    orderId,
    moreOptionsData
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const privateKey = privkey.startsWith("0x")
        ? ethJsUtil.toBuffer(privkey)
        : Buffer.from(privkey, "hex");
      const amountInEther = this.web3.utils.toWei(amount.toString(), "ether");
      const txValue = this.web3.utils.numberToHex(amountInEther);
      const txData = data;
      const getGasPrice = this.web3.eth.getGasPrice();
      const getTransactionCount = this.web3.eth.getTransactionCount(activeUser);
      const estimateGasParams: any = {
        to,
        from: activeUser,
        value: amountInEther
      };
      if(txData) {
        estimateGasParams.data = txData;
      }
      const estimateGas = this.web3.eth.estimateGas(estimateGasParams);
      return Promise.all([getGasPrice, getTransactionCount, estimateGas]).then(
        values => {
          const gasPrice = values[0];
          const nonce = parseInt(values[1], 10);
          const gas = parseInt(values[2], 10);
          const rawTransaction: any = {
            nonce: this.web3.utils.toHex(nonce),
            gas: this.web3.utils.toHex(gas),
            gasPrice: this.web3.utils.toHex(
              this.web3.utils.toWei(
                this.settingsService.settings.transactionSettings.gasPrice,
                "gwei"
              )
            ),
            to,
            value: txValue,
            data: txData
          };

          if (moreOptionsData.gasLimit) {
            rawTransaction.gasLimit = moreOptionsData.gasLimit;
          }

          const tx = new Tx(rawTransaction);
          tx.sign(privateKey);
          const transaction = this.web3.eth.sendSignedTransaction(
            ethJsUtil.addHexPrefix(tx.serialize().toString("hex"))
          );
          transaction
            .once("transactionHash", hash => {
              this.logger.logMessage(`Transaction hash received: ${hash}`);
              this.saveTransaction(
                activeUser,
                to,
                amount,
                "Pending transaction",
                hash,
                "Gas",
                null,
                null
              );
              this.notificationMessagesService.pendingTransactionNotification(
                hash
              );
            })
            .once("receipt", receipt => {
              this.logger.logMessage(`Transaction receipt received: ${receipt}`);
              this.web3.eth.getTransaction(receipt.transactionHash).then(res => {
                res.timestamp = Moment(new Date()).unix();
                if (external) {
                  if(this.environment.get().isMobileBuild) {
                    this.router.navigateByUrl('/');
                  }
                  window.location.href = urls.success;
                } else {
                  resolve(res);
                }
              });
            })
            .catch(error => {
              this.logger.logError(error);
              if (external) {
                if(this.environment.get().isMobileBuild) {
                  this.router.navigateByUrl('/');
                }
                window.location.href = urls.failed;
              } else {
                this.notificationMessagesService.failedTransactionNotification();
                reject(error);
              }
            });
        }
      ).catch(error => {
        this.logger.logError(error);
        if (external) {
          if(this.environment.get().isMobileBuild) {
            this.router.navigateByUrl('/');
          }
          window.location.href = urls.failed;
        } else {
          this.notificationMessagesService.failedTransactionNotification();
          reject(error);
        }
      });
    });
  }

  async sendTokens(
    myAddress,
    to,
    amount,
    contractAddress,
    external,
    urls,
    orderId,
    tokenName,
    decimals
  ) {
    const count = await this.web3.eth.getTransactionCount(myAddress);
    const tokensContract = new this.web3.eth.Contract(
      tokensABI,
      contractAddress,
      {
        from: myAddress,
        gas: this.settingsService.settings.transactionSettings.maxTransactionGas
      }
    );

    const gasPrice = await this.web3.eth.getGasPrice();
    const rawTransaction = {
      from: myAddress,
      nonce: this.web3.utils.toHex(count),
      gasPrice:
        this.web3.utils.toHex(gasPrice) ||
        this.web3.utils.toHex(
          this.web3.utils.toWei(
            this.settingsService.settings.transactionSettings.gasPrice,
            "gwei"
          )
        ),
      gasLimit: this.web3.utils.toHex(
        this.settingsService.settings.transactionSettings.maxTransactionGas
      ),
      to: contractAddress,
      value: "0x0",
      data: tokensContract.methods.transfer(to, amount).encodeABI()
    };
    const privKey = this.storageService.getSessionData("private_key");
    const privateKey = ethJsUtil.toBuffer(privKey);
    const tx = new Tx(rawTransaction);
    tx.sign(privateKey);

    const transaction = this.web3.eth.sendSignedTransaction(
      ethJsUtil.addHexPrefix(tx.serialize().toString("hex"))
    );
    transaction
      .on("transactionHash", hash => {
        this.web3.eth.getTransaction(hash).then(res => {
          this.saveTransaction(
            myAddress,
            to,
            0,
            "Contract execution(pending)",
            hash,
            "token",
            tokenName,
            decimals
          );
          this.web3.eth.getTransaction(hash).then(res => {
            res.timestamp = Moment(new Date()).unix();
            if (external) {
              if(this.environment.get().isMobileBuild) {
                this.router.navigateByUrl('/');
              }
              window.location.href = urls.success;
            } else {
              this.notificationMessagesService.pendingTransactionNotification(
                hash
              );
            }
          });
        });
      })
      .catch(error => {
        this.logger.logError(error);
        if (external) {
          if(this.environment.get().isMobileBuild) {
            this.router.navigateByUrl('/');
          }
          window.location.href = urls.failed;
        } else {
          this.notificationMessagesService.failedTransactionNotification();
        }
      });
  }

  checkAddressCode(address) {
    return new Promise((resolve, reject) => {
      this.web3.eth
        .getCode(address)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
