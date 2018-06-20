import { SwapState } from "./swap-state.enum";

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
