import { SwapState } from "@core/swap/models/swap-state.enum";

export interface CounterErc20Swap {
  hash: string;
  erc20Value: string;
  erc20ContractAddress: string;
  openTrader?: string;
  withdrawTrader?: string;
  state: SwapState;
  timelock: number;
}
