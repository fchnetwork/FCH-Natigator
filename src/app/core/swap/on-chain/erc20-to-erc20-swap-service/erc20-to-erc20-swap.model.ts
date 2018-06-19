import { SwapState } from "@core/swap/cross-chain/aerum-erc20-swap-service/swap-state.enum";
import { Token } from "@core/transactions/token-service/token.model";

export interface Erc20ToErc20Swap {
  id: string;
  openTrader: string;
  openValue: number;
  openToken: Token;
  closeTrader: string;
  closeValue: number;
  closeToken: Token;
  openedOn: Date;
  state: SwapState;
}
