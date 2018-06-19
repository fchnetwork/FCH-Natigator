import { SwapState } from "@core/swap/cross-chain/aerum-erc20-swap-service/swap-state.enum";

export interface Erc20ToErc20Swap {
  id: string;
  openTrader: string;
  openValue: number;
  openContractAddress: string;
  closeTrader: string;
  closeValue: number;
  closeContractAddress: string;
  openedOn: Date;
  state: SwapState;
}
