import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

import { environment } from "@env/environment";

import { sha3, fromWei } from 'web3-utils';
import Web3 from "web3";

import { genTransactionExplorerUrl } from "@shared/helpers/url-utils";
import { toBigNumberString } from "@shared/helpers/number-utils";
import { Guid } from "@shared/helpers/guid";
import { TokenError } from "@core/transactions/token-service/token.error";
import { InjectedWeb3Error } from "@external/models/injected-web3.error";
import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { EtherSwapReference } from "@core/swap/cross-chain/swap-local-storage/swap-reference.model";
import { Token } from "@core/transactions/token-service/token.model";
import { Chain } from "@core/swap/cross-chain/swap-template-service/chain.enum";
import { SwapTemplate } from "@core/swap/cross-chain/swap-template-service/swap-template.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { ClipboardService } from "@core/general/clipboard-service/clipboard.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { AerumNameService } from "@core/aens/aerum-name-service/aerum-name.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { TokenService } from "@core/transactions/token-service/token.service";
import { SwapTemplateService } from "@core/swap/cross-chain/swap-template-service/swap-template.service";
import { OpenEtherSwapService } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.service";
import { OpenErc20SwapService } from "@core/swap/cross-chain/open-erc20-swap-service/open-erc20-swap.service";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";

@Component({
  selector: 'app-swap-create',
  templateUrl: './swap-create.component.html',
  styleUrls: ['./swap-create.component.scss']
})
export class SwapCreateComponent implements OnInit, OnDestroy {

  private routeSubscription: Subscription;
  private params: { asset?: string, amount?: number, wallet?: EthWalletType, account?: string, query?: string, token?: string, symbol?: string } = {};
  private ethWeb3: Web3;

  secret: string;
  amount: number;

  tokens = [];
  selectedToken: Token;

  private ethAddress = '0x0';

  templates: SwapTemplate[] = [];
  selectedTemplate: SwapTemplate;

  rate: number;
  tokenAmount: number;
  walletToken: Token;
  walletTokenSymbol: string;

  openSwapTransactionExplorerUrl: string;

  processing = false;
  canCreateSwap = false;
  swapCreated = false;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private clipboardService: ClipboardService,
    private notificationService: InternalNotificationService,
    private nameService: AerumNameService,
    private ethereumAuthService: EthereumAuthenticationService,
    private tokenService: TokenService,
    private swapTemplateService: SwapTemplateService,
    private etherSwapService: OpenEtherSwapService,
    private erc20SwapService: OpenErc20SwapService,
    private ethereumTokenService: EthereumTokenService,
    private swapLocalStorageService: SwapLocalStorageService
  ) { }

  async ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(param => this.init(param));
    this.ethWeb3 = this.ethereumAuthService.getWeb3();
    this.secret = Guid.newGuid().replace(/-/g, '');
  }

  async init(param) {
    try {
      await this.tryInit(param);
    } catch (e) {
      if(e instanceof TokenError) {
        this.logger.logError('Cannot load token information', e);
        this.notificationService.showMessage('Please configure the token first', 'Error');
      } else {
        this.logger.logError('Swap data load error', e);
        this.notificationService.showMessage('Cannot load swap screen', 'Error');
      }
    }
  }

  async tryInit(param) {
    if (!param.account) {
      this.logger.logError('Ethereum account is required but not provided');
      throw new Error('Ethereum account is required but not provided');
    }

    this.params = {
      asset: await this.nameService.safeResolveNameOrAddress(param.asset),
      amount: Number(param.amount) || 0,
      wallet: param.wallet ? Number(param.wallet) : EthWalletType.Injected,
      account: param.account,
      query: param.query,
      token: param.token ? param.token : this.ethAddress,
      symbol: param.symbol ? param.symbol : 'ETH'
    };

    this.amount = this.params.amount;
    this.tokens = this.tokenService.getTokens() || [];
    this.walletTokenSymbol = this.params.symbol;

    await this.ensureTokenPresent(this.params.asset);
    await this.loadSwapTemplates();
    await this.loadWalletToken();
  }

  onTokenChange() {
    return this.loadSwapTemplates();
  }

  onTemplateChange() {
    return this.recalculateTotals();
  }

  onAmountChange(amount: string) {
    this.amount = Number(amount) || 0;
    return this.recalculateTotals();
  }

  private async ensureTokenPresent(address: string): Promise<void> {
    if (!address) {
      this.logger.logMessage("Token to check not specified");
      return;
    }

    const isPresent = this.tokens.some(token => token.address.toLowerCase() === address.toLowerCase());
    if (!isPresent) {
      await this.loadTokenAndAddToList(address);
    } else {
      this.selectDefaultToken();
    }
  }

  private loadTokenAndAddToList(address: string): Promise<void> {
    return this.tokenService.getTokensInfo(address).then(token => {
      this.tokens.unshift(token);
      this.selectDefaultToken();
    });
  }

  private async loadWalletToken() {
    if(this.params.token !== this.ethAddress){
      this.walletToken = await this.ethereumTokenService.getNetworkTokenInfo(this.params.wallet, this.params.token, this.params.account);
    }
  }

  private selectDefaultToken() {
    if (this.tokens.length) {
      const assetToken = this.tokens.find(token => token.address.toLowerCase() === this.params.asset.toLowerCase());
      if (assetToken) {
        this.selectedToken = assetToken;
      } else {
        this.selectedToken = this.tokens[0];
      }
    }
  }

  private async loadSwapTemplates(): Promise<void> {
    if (!this.selectedToken) {
      this.logger.logMessage("Token not selected");
      return;
    }
    const templates = await this.swapTemplateService.getTemplatesByAsset(this.selectedToken.address, this.params.token, Chain.Aerum);
    if (templates) {
      this.templates = templates.sort((one, two) => Number(one.rate <= two.rate));
      this.selectedTemplate = this.templates[0];
    } else {
      this.templates = [];
      this.selectedTemplate = null;
    }
    await this.recalculateTotals();
  }

  private async recalculateTotals() {
    if (this.selectedTemplate) {
      if(this.params.token === this.ethAddress) {
         await this.recalculateEthTotals();
      }else {
        await this.recalculateErc20Totals();
      }
    } else {
      this.rate = 0;
      this.tokenAmount = 0;
      this.canCreateSwap = false;
    }
  }

  private async recalculateEthTotals() {
    this.rate = this.selectedTemplate.rate;
    this.tokenAmount = this.amount / this.selectedTemplate.rate;
    if (this.params.account) {
      const balance = await this.ethWeb3.eth.getBalance(this.params.account);
      const ethBalance = Number(fromWei(balance, 'ether'));
      this.canCreateSwap = ethBalance >= this.tokenAmount;
    } else {
      this.canCreateSwap = false;
    }
  }

  private async recalculateErc20Totals() {
    this.rate = this.selectedTemplate.rate;
    this.tokenAmount = this.amount / this.selectedTemplate.rate;
    if (this.params.account) {
      this.canCreateSwap = this.walletToken.balance >= this.tokenAmount;
    } else {
      this.canCreateSwap = false;
    }
  }

  async copyToClipboard() {
    if (this.secret) {
      await this.clipboardService.copy(this.secret);
      this.notificationService.showMessage('Copied to clipboard!', 'Done');
    }
  }

  canMoveNext(): boolean {
    return this.canCreateSwap && !this.swapCreated && !this.processing && (this.amount > 0);
  }

  async next() {
    try {
      this.processing = true;
      this.notificationService.showMessage('Creating swap... (please wait 10-15 seconds)', 'In progress');
      await this.openSwap();
      this.notificationService.showMessage('Swap created. Waiting for confirmation...', 'Success');
    }
    catch (e) {
      // NOTE: We show more detailed errors for injected web3 in called functions
      if(!(e instanceof InjectedWeb3Error)) {
        this.logger.logError('Error while creating swap', e);
        this.notificationService.showMessage('Error while creating swap', 'Unhandled error');
      }
    } finally {
      this.processing = false;
    }
  }

  async openSwap() {
    this.openSwapTransactionExplorerUrl = null;

    const hash = sha3(this.secret);
    const timestamp = this.calculateTimestamp(environment.contracts.swap.crossChain.swapExpireTimeoutInSeconds);
    const counterpartyTrader =  await this.nameService.safeResolveNameOrAddress(this.selectedTemplate.offchainAccount);

    const options = {
      hashCallback: (txHash) => this.onOpenSwapHashReceived(txHash),
      account: this.params.account,
      wallet: this.params.wallet
    };

    if(this.params.token === this.ethAddress) {
      const amountString = toBigNumberString(this.tokenAmount);
      this.logger.logMessage(`Secret: ${this.secret}, hash: ${hash}, timestamp: ${timestamp}, trader: ${counterpartyTrader}. amount: ${amountString}`);
      await this.etherSwapService.openSwap(hash, amountString, counterpartyTrader, timestamp, options);
    }else {
      const amount = this.tokenAmount * Math.pow(10, this.walletToken.decimals);
      const amountString = toBigNumberString(amount);
      this.logger.logMessage(`Secret: ${this.secret}, hash: ${hash}, timestamp: ${timestamp}, trader: ${counterpartyTrader}. amount: ${amountString}`);
      await this.erc20SwapService.openSwap(hash, amountString, this.params.token, counterpartyTrader, timestamp, options);
    }

    const localSwap: EtherSwapReference = {
      hash,
      secret: this.secret,
      account: this.params.account,
      walletType: this.params.wallet,
      token: this.selectedToken.address,
      tokenAmount: this.amount
    };
    this.swapLocalStorageService.storeSwapReference(localSwap);

    this.swapCreated = true;
    this.logger.logMessage(`Swap ${hash} created`);
    return this.router.navigate(['external/confirm-swap'], {queryParams: {hash, query: this.params.query, token: this.params.token, symbol: this.params.symbol}});
  }

  private calculateTimestamp(timeoutInSeconds: number) {
    return Math.ceil((new Date().getTime() / 1000) + timeoutInSeconds);
  }

  private onOpenSwapHashReceived(hash: string): void {
    this.openSwapTransactionExplorerUrl = genTransactionExplorerUrl(hash, Chain.Ethereum);
  }

  cancel() {
    if(this.swapCreated && this.params.query) {
      return this.router.navigate(['external/transaction'], {queryParams: {query: this.params.query}});
    }
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
