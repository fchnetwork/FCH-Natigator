import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import { environment } from "@env/environment";

import { sha3, fromWei } from 'web3-utils';
import Web3 from "web3";

import { Guid } from "@shared/helpers/guid";
import { TokenError } from "@core/transactions/token-service/token.error";
import { SwapReference } from "@core/swap/cross-chain/swap-local-storage/swap-reference.model";
import { Chain } from "@core/swap/cross-chain/swap-template-service/chain.enum";
import { SwapTemplate } from "@core/swap/cross-chain/swap-template-service/swap-template.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { AerumNameService } from "@core/aens/aerum-name-service/aerum-name.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { TokenService } from "@core/transactions/token-service/token.service";
import { ERC20TokenService } from "@core/swap/on-chain/erc20-token-service/erc20-token.service";
import { SwapTemplateService } from "@core/swap/cross-chain/swap-template-service/swap-template.service";
import { EtherSwapService } from "@core/swap/cross-chain/ether-swap-service/ether-swap.service";
import { SelfSignedEthereumContractExecutorService } from "@core/ethereum/self-signed-ethereum-contract-executor-service/self-signed-ethereum-contract-executor.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { ClipboardService } from "@core/general/clipboard-service/clipboard.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";

@Component({
  selector: 'app-swap-create',
  templateUrl: './swap-create.component.html',
  styleUrls: ['./swap-create.component.scss']
})
export class SwapCreateComponent implements OnInit, OnDestroy {

  private routeSubscription: Subscription;
  private params: { asset?: string, amount?: number, wallet?: EthWalletType, account?: string, query?: string } = {};
  private ethWeb3: Web3;

  secret: string;
  amount: number;

  tokens = [];
  selectedToken: any;

  templates: SwapTemplate[] = [];
  selectedTemplate: SwapTemplate;

  rate: number;
  ethAmount: number;

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
    private erc20TokenService: ERC20TokenService,
    private swapTemplateService: SwapTemplateService,
    private etherSwapService: EtherSwapService,
    private swapLocalStorageService: SwapLocalStorageService,
    private injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService,
    private selfSignedEthereumContractExecutorService: SelfSignedEthereumContractExecutorService
  ) {
  }

  ngOnInit() {
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
    this.params = {
      asset: await this.nameService.safeResolveNameOrAddress(param.asset),
      amount: Number(param.amount) || 0,
      wallet: param.wallet ? Number(param.wallet) : EthWalletType.Injected,
      account: param.account,
      query: param.query
    };
    this.amount = this.params.amount;
    this.tokens = this.tokenService.getTokens() || [];
    await this.ensureTokenPresent(this.params.asset);
    await this.loadSwapTemplates();
  }

  onTokenChange() {
    return this.loadSwapTemplates();
  }

  onTemplateChange() {
    return this.recalculateTotals();
  }

  onAmountChange() {
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

    // TODO: We support Eth -> Aerum (ERC20) for now only
    const templates = await this.swapTemplateService.getTemplatesByAsset(this.selectedToken.address, Chain.Aerum);
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
      this.rate = this.selectedTemplate.rate;
      this.ethAmount = this.amount / this.selectedTemplate.rate;
      if (this.params.account) {
        const balance = await this.ethWeb3.eth.getBalance(this.params.account);
        const ethBalance = Number(fromWei(balance, 'ether'));
        this.canCreateSwap = ethBalance >= this.ethAmount;
      } else {
        this.canCreateSwap = false;
      }
    } else {
      this.rate = 0;
      this.ethAmount = 0;
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
    return this.canCreateSwap && !this.processing;
  }

  async next() {
    try {
      this.processing = true;
      this.notificationService.showMessage('Creating swap... (please wait 10-15 seconds)', 'In progress');
      await this.openEthereumSwap();
      this.notificationService.showMessage('Swap created. Waiting for confirmation...', 'Success');
    }
    catch (e) {
      this.logger.logError('Error while creating swap', e);
      this.notificationService.showMessage('Error while creating swap', 'Unhandled error');
      // NOTE: We only allow process next in case there is event
      this.processing = false;
    }
  }

  async openEthereumSwap() {
    await this.configureSwapService();

    const hash = sha3(this.secret);
    const ethAmountString = this.ethAmount.toString(10);
    const timestamp = this.calculateTimestamp(environment.contracts.swap.crossChain.swapExpireTimeoutInSeconds);
    const counterpartyTrader = this.selectedTemplate.offchainAccount;

    this.logger.logMessage(`Secret: ${this.secret}, hash: ${hash}, timestamp: ${timestamp}, trader: ${counterpartyTrader}. amount: ${ethAmountString}`);

    await this.etherSwapService.openSwap(hash, ethAmountString, counterpartyTrader, timestamp);
    const localSwap: SwapReference = {
      hash,
      secret: this.secret,
      amount: this.ethAmount,
      counterparty: this.selectedTemplate.onchainAccount,
      account: this.params.account,
      walletType: this.params.wallet,
      timelock: timestamp
    };
    this.swapLocalStorageService.storeSwapReference(localSwap);

    this.swapCreated = true;
    this.logger.logMessage(`Swap ${hash} created`);

    return this.router.navigate(['external/confirm-swap'], {queryParams: {hash, query: this.params.query}});
  }

  private async configureSwapService() {
    if (this.params.wallet === EthWalletType.Injected) {
      await this.configureInjectedSwapService();
    } else {
      this.configureImportedSwapService();
    }
  }

  private async configureInjectedSwapService() {
    const injectedWeb3 = await this.ethereumAuthService.getInjectedWeb3();
    if (!injectedWeb3) {
      this.notificationService.showMessage('Injected web3 not provided', 'Error');
      throw Error('Injected web3 not provided');
    }

    const accounts = await injectedWeb3.eth.getAccounts() || [];
    if (!accounts.length) {
      this.notificationService.showMessage('Please login in Mist / Metamask', 'Error');
      throw Error('Cannot get accounts from selected provider');
    }

    if (accounts[0] !== this.params.account) {
      this.notificationService.showMessage(`Please select ${this.params.account} and retry`, 'Error');
      throw Error(`Incorrect Mist / Metamask account selected. Expected ${this.params.account}. Selected ${accounts[0]}`);
    }

    this.injectedWeb3ContractExecutorService.init(injectedWeb3, accounts[0]);
    this.etherSwapService.useContractExecutor(this.injectedWeb3ContractExecutorService);
  }

  private configureImportedSwapService() {
    const importedAccount = this.ethereumAuthService.getEthereumAccount(this.params.account);
    if (!importedAccount) {
      this.notificationService.showMessage(`Cannot load imported account ${this.params.account}`, 'Error');
      throw Error(`Cannot load imported account ${this.params.account}`);
    }

    this.selfSignedEthereumContractExecutorService.init(this.ethWeb3, importedAccount.address, importedAccount.privateKey);
    this.etherSwapService.useContractExecutor(this.selfSignedEthereumContractExecutorService);
  }

  private calculateTimestamp(timeoutInSeconds: number) {
    return Math.ceil((new Date().getTime() / 1000) + timeoutInSeconds);
  }

  cancel() {
    if(this.swapCreated) {
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
