import { Token } from "@core/transactions/token-service/token.model";
import { SwapState } from "@core/swap/models/swap-state.enum";

export interface OpenErc20Swap {
  hash: string;
  openTrader: string;
  withdrawTrader: string;
  erc20Value: number;
  erc20ContractAddress: string;
  erc20Token: Token;
  timelock: number;
  openedOn: Date;
  state: SwapState;
}
