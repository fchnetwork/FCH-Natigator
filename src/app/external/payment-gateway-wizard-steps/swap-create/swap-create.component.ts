import { Component, Input, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import { sha3 } from 'web3-utils';

import { Guid } from "@shared/helpers/guid";
import { PaymentGatewayWizardStep } from "../payment-gateway-wizard-step";
import { AerumNameService } from '@app/core/aens/aerum-name-service/aerum-name.service';
import { TokenService } from "@core/transactions/token-service/token.service";
import { SwapTemplateService } from "@core/swap/cross-chain/swap-template-service/swap-template.service";
import { Chain } from "@core/swap/cross-chain/swap-template-service/chain.enum";
import { SwapTemplate } from "@core/swap/cross-chain/swap-template-service/swap-template.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { EtherSwapService } from "@core/swap/cross-chain/ether-swap-service/ether-swap.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { SelfSignedEthereumContractExecutorService } from "@core/ethereum/self-signed-ethereum-contract-executor-service/self-signed-ethereum-contract-executor.service";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";

@Component({
  selector: 'app-swap-create',
  templateUrl: './swap-create.component.html',
  styleUrls: ['./swap-create.component.scss']
})
export class SwapCreateComponent extends PaymentGatewayWizardStep implements OnInit {
  @Input() asset: string;
  @Input() amount: number;
  @Input() account: EthereumAccount;

  tokens = [];
  selectedToken: any;
  secret: string;

  templates: SwapTemplate[] = [];
  selectedTemplate: SwapTemplate;
  rate: number;
  ethAmount: number;

  aerumAccount: string;

  constructor(
    location: Location,
    private logger: LoggerService,
    private nameService: AerumNameService,
    private authService: AuthenticationService,
    private ethereumAuthService: EthereumAuthenticationService,
    private tokenService: TokenService,
    private swapTemplateService: SwapTemplateService,
    private etherSwapService: EtherSwapService,
    private selfSignedEthereumContractExecutorService: SelfSignedEthereumContractExecutorService
  ) {
    super(location);
  }

  ngOnInit() {
    const keystore = this.authService.getKeystore();
    this.aerumAccount  = "0x" + keystore.address;

    this.secret = Guid.newGuid().replace(/-/g, '');
    this.tokens = this.tokenService.getTokens() || [];
    this.ensureDepositTokenPresent().then(() => this.loadSwapTemplates());
    // TODO: Test code to register swap template
    // this.registerTestSwapTemplate().then(() => console.log('Template registered!'));
  }

  private ensureDepositTokenPresent(): Promise<void> {
    const isPresent = this.tokens.some(token => token.address === this.asset);
    if(!isPresent) {
      return this.loadDepositTokenAndAddToList();
    } else {
      this.selectDefaultToken();
      return Promise.resolve();
    }
  }

  private loadDepositTokenAndAddToList(): Promise<void> {
    if(!this.asset) {
      this.logger.logMessage("Deposit asset not specified");
      return;
    }

    // TODO: Maybe add ANS resolver?
    return this.tokenService.getTokensInfo(this.asset).then(token => {
      this.tokens = this.tokens.splice(0, 0, token);
      this.selectDefaultToken();
    });
  }

  private selectDefaultToken() {
    if(this.tokens.length) {
      const assetToken = this.tokens.find(token => token.address === this.asset);
      if(assetToken) {
        this.selectedToken = assetToken;
      } else {
        this.selectedToken = this.tokens[0];
      }
    }
  }

  private loadSwapTemplates(): void {
    if(!this.selectedToken) {
      this.logger.logMessage("Token not selected");
      return;
    }

    const selectedAsset = this.selectedToken.address;
    // TODO: We support Aerum for now only
    this.swapTemplateService.getTemplatesByAsset(selectedAsset, Chain.Aerum).then(templates => {
      if(templates) {
        this.templates = templates.sort((one, two) => Number(one.rate <= two.rate));
        this.selectedTemplate = this.templates[0];
      } else {
        this.templates = [];
        this.selectedTemplate = null;
      }
      this.recalculateTotals();
    });
  }

  private recalculateTotals() {
    if(this.selectedTemplate) {
      this.rate = this.selectedTemplate.rate;
      this.ethAmount = this.amount / this.selectedTemplate.rate;
    } else {
      this.rate = 0;
      this.ethAmount = 0;
    }
  }

  onTokenChange() {
    this.loadSwapTemplates();
  }

  onTemplateChange() {
    this.recalculateTotals();
  }

  onAmountChange() {
    this.recalculateTotals();
  }

  async next() {
    if(this.selectedTemplate) {
      await this.createEthereumSwap();
    }
  }

  async createEthereumSwap() {
    const hash = sha3(this.secret);
    const ethAmountString = this.ethAmount.toString(10);
    const timeoutInSeconds = 5 * 60;
    const timestamp = Math.ceil((new Date().getTime() / 1000) + timeoutInSeconds);

    const withdrawTrader = this.selectedTemplate.offchainAccount;
    this.logger.logMessage(`Secret: ${this.secret}, hash: ${hash}, timestamp: ${timestamp}, trader: ${withdrawTrader}. amount: ${ethAmountString}`);

    const ethWeb3 = await this.ethereumAuthService.getWeb3();
    this.selfSignedEthereumContractExecutorService.init(ethWeb3, this.account.address, this.account.privateKey);
    this.etherSwapService.useContractExecutor(this.selfSignedEthereumContractExecutorService);

    // TODO: Unsubscribe
    /*
    this.etherSwapService.onOpen(hash, (err, event) => {
      if(err) {
        this.logger.logError(`Create swap error: ${hash}`, err);
      } else {
        this.logger.logMessage(`Create swap success: ${hash}`, event);
      }
    });
    */

    const cost = await this.etherSwapService.estimateOpenSwap(hash, ethAmountString, withdrawTrader, timestamp);
    this.logger.logMessage(`Swap cost: ${hash}`, cost);
    await this.etherSwapService.openSwap(hash, ethAmountString, withdrawTrader, timestamp);
    this.logger.logMessage(`Swap created: ${hash}`);
    const swap = await this.etherSwapService.checkSwap(hash);
    this.logger.logMessage(`Swap checked: ${hash}`, swap);
  }

  // TODO: Test code to register swap template
  async registerTestSwapTemplate() {
    const id =  Guid.newGuid().replace(/-/g, '');
    this.logger.logMessage(`Template: ${id}`);
    await this.swapTemplateService.registerTemplate(id, this.asset, 'sidlovskyy.aer', '0x0', "0xf38edc62732c418ee18bebf89cc063b3d1b57e0c", 500, Chain.Aerum);
    this.logger.logMessage(`Template created: ${id}`);
    const template = await this.swapTemplateService.getTemplateById(id);
    this.logger.logMessage(`Template loaded: ${id}`, template);
  }
}
