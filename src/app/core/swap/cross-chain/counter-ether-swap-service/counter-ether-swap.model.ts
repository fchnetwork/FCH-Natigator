import { SwapState } from "@core/swap/models/swap-state.enum";

export interface CounterEtherSwap {
  hash: string;
  openTrader: string;
  withdrawTrader: string;
  value: number;
  timelock: number;
  openedOn: Date;
  state: SwapState;
}
