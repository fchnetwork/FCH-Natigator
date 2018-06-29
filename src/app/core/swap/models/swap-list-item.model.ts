import { SwapState } from "./swap-state.enum";
import { SwapType } from "./swap-type.enum";

export interface SwapListItem {
  id: string;
  counterparty: string;
  openAsset: string;
  openValue: number;
  closeAsset: string;
  closeValue: number;
  createdOn: Date;
  state: SwapState;
  type?: SwapType;
}
