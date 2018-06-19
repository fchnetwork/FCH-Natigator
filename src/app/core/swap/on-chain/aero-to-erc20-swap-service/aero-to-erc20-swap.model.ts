import { SwapState } from "@core/swap/cross-chain/aerum-erc20-swap-service/swap-state.enum";
import { Token } from "@core/transactions/token-service/token.model";

export interface AeroToErc20Swap {
  id: string;
  erc20Trader: string;
  erc20Value: number;
  erc20Token: Token;
  ethTrader: string;
  ethValue: number;
  openedOn: Date;
  state: SwapState;
}
