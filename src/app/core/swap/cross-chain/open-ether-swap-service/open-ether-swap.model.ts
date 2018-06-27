import { SwapState } from "@core/swap/models/swap-state.enum";

export interface OpenEtherSwap {
  hash: string;
  openTrader: string;
  withdrawTrader: string;
  value: number;
  timelock: number;
  openedOn: Date;
  state: SwapState;
}
