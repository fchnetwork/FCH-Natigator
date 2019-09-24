import { Injectable } from "@angular/core";
import {
  SwapMode,
  SwapStatus,
  LoadedSwap
} from "@app/wallet/swap/models/models";
import { NotificationService, DialogResult } from "@aerum/ui";
import { LoggerService } from "@app/core/general/logger-service/logger.service";
import { TokenError } from "@app/core/transactions/token-service/token.error";
import { Token } from "@app/core/transactions/token-service/token.model";
import {
  fromSolidityDecimalString,
  toBigNumberString
} from "@app/shared/helpers/number-utils";
import { fromWei } from "web3-utils";
import { TokenService } from "@app/core/transactions/token-service/token.service";
import { ERC20TokenService } from "@app/core/swap/on-chain/erc20-token-service/erc20-token.service";
import { Erc20ToErc20SwapService } from "@app/core/swap/on-chain/erc20-to-erc20-swap-service/erc20-to-erc20-swap.service";
import { Erc20ToAeroSwapService } from "@app/core/swap/on-chain/erc20-to-aero-swap-service/erc20-to-aero-swap.service";
import { AeroToErc20SwapService } from "@app/core/swap/on-chain/aero-to-erc20-swap-service/aero-to-erc20-swap.service";
import { ModalService } from "@app/core/general/modal-service/modal.service";
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";
import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { TransactionReceipt } from "web3/types";

interface SwapCommonOperationsService {
  expireSwap(swapId: string): Promise<TransactionReceipt>;
  checkSwap(swapId: string): Promise<any>;
}

@Injectable()
export class LoadSwapService {
  constructor(
    private logger: LoggerService,
    private authService: AuthenticationService,
    private modalService: ModalService,
    private aeroToErc20SwapService: AeroToErc20SwapService,
    private erc20ToAeroSwapService: Erc20ToAeroSwapService,
    private erc20ToErc20SwapService: Erc20ToErc20SwapService,
    private erc20TokenService: ERC20TokenService,
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private environment: EnvironmentService
  ) {}

  async loadSwap(swapId) {
    try {
      const swapMode = this.getSwapModel(swapId);
      await this.showSwapInModalAndProcess(swapId, swapMode);
    } catch (e) {
      if (e instanceof TokenError) {
        this.logger.logError(
          "Swap action error. Cannot load token information",
          e
        );
        this.notificationService.notify(
          "Error",
          "Please configure swap token first",
          "aerum",
          3000
        );
      } else {
        this.logger.logError("Swap action error:", e);
        this.notificationService.notify(
          "Error",
          "Swap not found or invalid",
          "aerum",
          3000
        );
      }
    }
  }

  private getSwapModel(swapId): SwapMode {
    const prefixLength = 3;
    if (!swapId || swapId.length <= prefixLength) {
      return "unknown";
    }

    const swapPrefix = swapId.slice(0, prefixLength);
    switch (swapPrefix) {
      case "a2e":
        return "aero_to_erc20";
      case "e2a":
        return "erc20_to_aero";
      case "e2e":
        return "erc20_to_erc20";
      case "a2a":
        return "aero_to_aero";
      default:
        return "unknown";
    }
  }

  private async showSwapInModalAndProcess(swapId, mode: SwapMode) {
    const swapService = this.getCurrentSwapService(mode);
    const swap = await swapService.checkSwap(swapId);
    this.logger.logMessage("Original swap:", swap);

    const status = this.mapSwapStatus(swap.state);
    if (status === "Invalid") {
      throw new Error(`Swap wit ID ${swapId} not found or invalid`);
    }

    const loadedSwap = await this.mapToLoadedSwap(swapId, swap, mode);
    this.logger.logMessage("Mapped swap:", loadedSwap);

    const modalResponse = await this.modalService.openSwapLoadConfirm(
      loadedSwap
    );
    if (modalResponse.dialogResult === DialogResult.OK) {
      if (modalResponse.result.confirmed) {
        this.notificationService.notify(
          "Swap completion in progress...",
          `Swap ID: ${swapId}`,
          "aerum",
          3000
        );
        await this.confirm(loadedSwap, swapId, mode);
        this.notificationService.notify(
          "Swap done",
          `Swap ID: ${swapId}`,
          "aerum"
        );
      } else if (modalResponse.result.rejected) {
        this.notificationService.notify(
          "Swap rejection in progress...",
          `Swap ID: ${swapId}`,
          "aerum",
          3000
        );
        await this.reject(swapId, mode);
        this.notificationService.notify(
          "Swap rejected",
          `Swap ID: ${swapId}`,
          "aerum"
        );
      }
    }
  }

  private mapSwapStatus(status: string): SwapStatus {
    switch (status) {
      case "1":
        return "Open";
      case "2":
        return "Closed";
      case "3":
        return "Expired";
      default:
        return "Invalid";
    }
  }

  private async confirm(swap: LoadedSwap, swapId, mode: SwapMode) {
    this.logger.logMessage(`Confirming swap: ${swapId}`);
    if (mode === "aero_to_erc20") {
      await this.confirmAeroToErc20Swap(swap, swapId);
    } else if (mode === "erc20_to_erc20") {
      await this.confirmErc20ToErc20Swap(swap, swapId);
    } else if (mode === "erc20_to_aero") {
      await this.confirmErc20ToAeroSwap(swap, swapId);
    }
  }

  private async confirmAeroToErc20Swap(swap: LoadedSwap, swapId) {
    await this.ensureAllowance(
      swap.counterpartyTokenAddress,
      this.environment.get().contracts.swap.address.AeroToErc20,
      Number(swap.counterpartyAmount)
    );
    await this.aeroToErc20SwapService.closeSwap(swapId);
  }

  private async confirmErc20ToErc20Swap(swap: LoadedSwap, swapId) {
    await this.ensureAllowance(
      swap.counterpartyTokenAddress,
      this.environment.get().contracts.swap.address.Erc20ToErc20,
      Number(swap.counterpartyAmount)
    );
    await this.erc20ToErc20SwapService.closeSwap(swapId);
  }

  private async confirmErc20ToAeroSwap(swap: LoadedSwap, swapId) {
    const closeEtherAmount = fromWei(swap.counterpartyAmount, "ether");
    await this.erc20ToAeroSwapService.closeSwap(swapId, closeEtherAmount);
  }

  private async ensureAllowance(
    tokenContractAddress: string,
    spender: string,
    amount: number
  ) {
    const allowance = await this.erc20TokenService.allowance(
      tokenContractAddress,
      this.authService.getAddress(),
      spender
    );
    if (Number(allowance) < amount) {
      this.logger.logMessage(
        `Allowance value: ${allowance}. Needed: ${amount}`
      );
      await this.erc20TokenService.approve(
        tokenContractAddress,
        spender,
        toBigNumberString(amount)
      );
    }
  }

  private async reject(swapId, mode: SwapMode) {
    this.logger.logMessage(`Rejecting swap: ${swapId}`);
    const swapService = this.getCurrentSwapService(mode);
    await swapService.expireSwap(swapId);
  }

  private getCurrentSwapService(mode: SwapMode): SwapCommonOperationsService {
    switch (mode) {
      case "aero_to_erc20":
        return this.aeroToErc20SwapService;
      case "erc20_to_aero":
        return this.erc20ToAeroSwapService;
      case "erc20_to_erc20":
        return this.erc20ToErc20SwapService;
      default:
        throw new Error("Swap type is not supported");
    }
  }

  private async mapToLoadedSwap(
    swapId: string,
    swap: any,
    mode: SwapMode
  ): Promise<LoadedSwap> {
    if (mode === "aero_to_erc20") {
      return await this.mapToLoadedSwapFromAeroToErc20Swap(swapId, swap);
    } else if (mode === "erc20_to_aero") {
      return await this.mapToLoadedSwapFromErc20ToAeroSwap(swapId, swap);
    } else if (mode === "erc20_to_erc20") {
      return await this.mapToLoadedSwapFromErc20ToErc20Swap(swapId, swap);
    } else {
      throw new Error(`Not supported swap mode: ${mode}`);
    }
  }

  private async mapToLoadedSwapFromAeroToErc20Swap(
    swapId: string,
    swap: any
  ): Promise<LoadedSwap> {
    const counterpartyTokenInfo: Token = await this.tokenService.getTokensInfo(
      swap.erc20ContractAddress
    );
    return {
      swapId,
      tokenAmount: swap.ethValue,
      tokenAmountFormatted: fromWei(swap.ethValue, "ether"),
      tokenTrader: swap.ethTrader,
      tokenAddress: "",
      counterpartyAmount: swap.erc20Value,
      counterpartyAmountFormatted: this.getDecimalTokenValue(
        swap.erc20Value,
        Number(counterpartyTokenInfo.decimals)
      ),
      counterpartyTrader: swap.erc20Trader,
      counterpartyTokenAddress: swap.erc20ContractAddress,
      counterpartyTokenInfo,
      status: this.mapSwapStatus(swap.state)
    };
  }

  private async mapToLoadedSwapFromErc20ToAeroSwap(
    swapId: string,
    swap: any
  ): Promise<LoadedSwap> {
    const tokenInfo: Token = await this.tokenService.getTokensInfo(
      swap.erc20ContractAddress
    );
    return {
      swapId,
      tokenAmount: swap.erc20Value,
      tokenAmountFormatted: this.getDecimalTokenValue(
        swap.erc20Value,
        Number(tokenInfo.decimals)
      ),
      tokenTrader: swap.erc20Trader,
      tokenAddress: swap.erc20ContractAddress,
      tokenInfo,
      counterpartyAmount: swap.ethValue,
      counterpartyAmountFormatted: fromWei(swap.ethValue, "ether"),
      counterpartyTrader: swap.ethTrader,
      counterpartyTokenAddress: "",
      status: this.mapSwapStatus(swap.state)
    };
  }

  private async mapToLoadedSwapFromErc20ToErc20Swap(
    swapId: string,
    swap: any
  ): Promise<LoadedSwap> {
    const [tokenInfo, counterpartyTokenInfo]: [
      Token,
      Token
    ] = await Promise.all([
      this.tokenService.getTokensInfo(swap.openContractAddress),
      this.tokenService.getTokensInfo(swap.closeContractAddress)
    ]);
    return {
      swapId,
      tokenAmount: swap.openValue,
      tokenAmountFormatted: this.getDecimalTokenValue(
        swap.openValue,
        Number(tokenInfo.decimals)
      ),
      tokenTrader: swap.openTrader,
      tokenAddress: swap.openContractAddress,
      tokenInfo,
      counterpartyAmount: swap.closeValue,
      counterpartyAmountFormatted: this.getDecimalTokenValue(
        swap.closeValue,
        Number(counterpartyTokenInfo.decimals)
      ),
      counterpartyTrader: swap.closeTrader,
      counterpartyTokenAddress: swap.closeContractAddress,
      counterpartyTokenInfo,
      status: this.mapSwapStatus(swap.state)
    };
  }

  private getDecimalTokenValue(value: string, decimals: number) {
    return fromSolidityDecimalString(value, decimals);
  }
}
