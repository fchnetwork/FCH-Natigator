import { SwapState } from "@core/swap/cross-chain/aerum-erc20-swap-service/swap-state.enum";

export interface Erc20ToAeroSwap {
  id: string;
  erc20Trader: string;
  erc20Value: number;
  erc20ContractAddress: string;
  ethTrader: string;
  ethValue: number;
  openedOn: Date;
  state: SwapState;
}
