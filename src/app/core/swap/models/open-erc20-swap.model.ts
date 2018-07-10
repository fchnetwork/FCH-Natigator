import { SwapState } from "@core/swap/models/swap-state.enum";

export interface OpenErc20Swap {
  hash: string;
  openTrader: string;
  withdrawTrader: string;
  erc20Value: number;
  erc20ContractAddress: string;
  timelock: number;
  openedOn: Date;
  state: SwapState;
}
