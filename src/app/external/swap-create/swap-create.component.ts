import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import { environment } from "@env/environment";

import { sha3, fromWei } from 'web3-utils';
import Web3 from "web3";

import { Guid } from "@shared/helpers/guid";
import { Chain } from "@core/swap/cross-chain/swap-template-service/chain.enum";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";
import { SwapTemplate } from "@core/swap/cross-chain/swap-template-service/swap-template.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { AerumNameService } from "@core/aens/aerum-name-service/aerum-name.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { TokenService } from "@core/transactions/token-service/token.service";
import { ERC20TokenService } from "@core/swap/on-chain/erc20-token-service/erc20-token.service";
import { SwapTemplateService } from "@core/swap/cross-chain/swap-template-service/swap-template.service";
import { EtherSwapService } from "@core/swap/cross-chain/ether-swap-service/ether-swap.service";
import { AerumErc20SwapService } from "@core/swap/cross-chain/aerum-erc20-swap-service/aerum-erc20-swap.service";
import { SelfSignedEthereumContractExecutorService } from "@core/ethereum/self-signed-ethereum-contract-executor-service/self-signed-ethereum-contract-executor.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { EthWalletType } from "@external/models/eth-wallet-type.enum";

@Component({
  selector: 'app-swap-create',
  templateUrl: './swap-create.component.html',
  styleUrls: ['./swap-create.component.scss']
})
export class SwapCreateComponent implements OnInit, OnDestroy {

  private routeSubscription: Subscription;
  private params: { asset?: string, amount?: number, wallet?: EthWalletType, account?: string } = {};
  // TODO: Remove this?
  private ethWeb3: Web3;

  secret: string;
  amount: number;

  tokens = [];
  selectedToken: any;

  templates: SwapTemplate[] = [];
  selectedTemplate: SwapTemplate;

  rate: number;
  ethAmount: number;

  aerumAccount: string;

  canMoveNext = false;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private nameService: AerumNameService,
    private authService: AuthenticationService,
    private ethereumAuthService: EthereumAuthenticationService,
    private tokenService: TokenService,
    private erc20TokenService: ERC20TokenService,
    private swapTemplateService: SwapTemplateService,
    private etherSwapService: EtherSwapService,
    private aerumErc20SwapService: AerumErc20SwapService,
    private selfSignedEthereumContractExecutorService: SelfSignedEthereumContractExecutorService
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(async param => {
      this.params = {
        asset: param.asset,
        amount: Number(param.amount) || 0,
        wallet: param.wallet ? EthWalletType[param.wallet as string] : EthWalletType.Injected,
        account: param.account
      };

      this.amount = this.params.amount;
      this.tokens = this.tokenService.getTokens() || [];
      await this.ensureTokenPresent(this.params.asset);
      await this.loadSwapTemplates();
    });

    const keystore = this.authService.getKeystore();
    this.aerumAccount = "0x" + keystore.address;
    this.ethWeb3 = this.ethereumAuthService.getWeb3();
    this.secret = Guid.newGuid().replace(/-/g, '');

    // TODO: Test code to register swap template. Remove after testing
    // this.registerTestSwapTemplate().then(() => console.log('Template registered!'));
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

    const isPresent = this.tokens.some(token => token.address === address);
    if (!isPresent) {
      await this.loadTokenAndAddToList(address);
    } else {
      this.selectDefaultToken();
    }
  }

  private loadTokenAndAddToList(address: string): Promise<void> {
    return this.tokenService.getTokensInfo(address).then(token => {
      this.tokens = this.tokens.splice(0, 0, token);
      this.selectDefaultToken();
    });
  }

  private selectDefaultToken() {
    if (this.tokens.length) {
      const assetToken = this.tokens.find(token => token.address === this.params.asset);
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
        this.canMoveNext = ethBalance >= this.ethAmount;
      } else {
        this.canMoveNext = false;
      }
    } else {
      this.rate = 0;
      this.ethAmount = 0;
      this.canMoveNext = false;
    }
  }

  async next() {
    try {
      if (this.selectedTemplate) {
        await this.createEthereumSwap();
      }
    }
    catch (e) {
      this.logger.logError('Error while creating swap', e);
      this.notificationService.showMessage('Error while creating swap', 'Unhandled error');
    }
  }

  async createEthereumSwap() {
    this.notificationService.showMessage('Creating swap... (please wait 10-15 seconds)', 'In progress');

    const hash = sha3(this.secret);
    const ethAmountString = this.ethAmount.toString(10);
    const timeoutInSeconds = 5 * 60;
    const timestamp = Math.ceil((new Date().getTime() / 1000) + timeoutInSeconds);

    const withdrawTrader = this.selectedTemplate.offchainAccount;
    this.logger.logMessage(`Secret: ${this.secret}, hash: ${hash}, timestamp: ${timestamp}, trader: ${withdrawTrader}. amount: ${ethAmountString}`);

    // this.selfSignedEthereumContractExecutorService.init(this.ethWeb3, this.account.address, this.account.privateKey);
    this.etherSwapService.useContractExecutor(this.selfSignedEthereumContractExecutorService);

    this.aerumErc20SwapService.onOpen(hash, (err, event) => {
      if (err) {
        this.logger.logError(`Create swap error: ${hash}`, err);
        this.notificationService.showMessage('Error while listening for swap', 'Unhandled error');
      } else {
        this.logger.logMessage(`Create swap success: ${hash}`, event);
        this.router.navigate(['external/confirm-swap']);
      }
    });

    await this.etherSwapService.openSwap(hash, ethAmountString, withdrawTrader, timestamp);
    this.notificationService.showMessage('Swap created', 'Success');

    // TODO: Test code to create counter swap
    // this.testAerumErc20Swap();
  }

  cancel() {
    this.location.back();
  }

  // TODO: Test code to register swap template.
  async registerTestSwapTemplate() {
    const id = Guid.newGuid().replace(/-/g, '');
    this.logger.logMessage(`Template: ${id}`);
    await this.swapTemplateService.registerTemplate(id, this.selectedToken.address, 'sidlovskyy.aer', '0x0', "0xf38edc62732c418ee18bebf89cc063b3d1b57e0c", 500, Chain.Aerum);
    this.logger.logMessage(`Template created: ${id}`);
    const template = await this.swapTemplateService.getTemplateById(id);
    this.logger.logMessage(`Template loaded: ${id}`, template);
  }

  // TODO: Test code to create counter swap
  async testAerumErc20Swap() {
    const hash = sha3(this.secret);
    const amount = (10 * Math.pow(10, 18));
    const tokenAddress = this.selectedToken.address;
    const timeoutInSeconds = 5 * 60;
    const timestamp = Math.ceil((new Date().getTime() / 1000) + timeoutInSeconds);

    const erc20SwapContract = environment.contracts.swap.crossChain.address.aerum.Erc20Swap;
    await this.ensureAllowance(tokenAddress, erc20SwapContract, amount);

    this.logger.logMessage(`Secret: ${this.secret}, hash: ${hash}, timestamp: ${timestamp}, trader: ${this.aerumAccount}, token: ${tokenAddress}`);
    await this.aerumErc20SwapService.openSwap(hash, amount.toString(10), tokenAddress, this.aerumAccount, timestamp);
    this.logger.logMessage(`Swap created: ${hash}`);
    const swap = await this.aerumErc20SwapService.checkSwap(hash);
    this.logger.logMessage(`Swap checked: ${hash}`, swap);
  }

  // TODO: Test code to create counter swap
  private async ensureAllowance(tokenContractAddress: string, spender: string, amount: number) {
    const allowance = await this.erc20TokenService.allowance(tokenContractAddress, this.aerumAccount, spender);
    if (Number(allowance) < amount) {
      this.logger.logMessage(`Allowance value: ${allowance}. Needed: ${amount}`);
      await this.erc20TokenService.approve(tokenContractAddress, spender, amount.toString(10));
    }
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
