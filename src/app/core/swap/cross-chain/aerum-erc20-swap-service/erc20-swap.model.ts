import { SwapState } from "./swap-state.enum";

export interface Erc20Swap {
  hash: string;
  erc20Value: string;
  erc20ContractAddress: string;
  state: SwapState;
  timelock: number;
}
