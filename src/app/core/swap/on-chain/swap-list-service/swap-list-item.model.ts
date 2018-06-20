import { SwapState } from "@core/swap/cross-chain/aerum-erc20-swap-service/swap-state.enum";

export interface SwapListItem {
  id: string;
  counterparty: string;
  openAsset: string;
  openValue: number;
  closeAsset: string;
  closeValue: number;
  createdOn: Date;
  state: SwapState;
}
