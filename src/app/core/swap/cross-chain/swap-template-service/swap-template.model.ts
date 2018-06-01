import { Chain } from "./chain.enum";
import { State } from "./state.enum";

export class SwapTemplate {
  owner: string;
  onchainAsset: string;
  onchainAccount: string;
  offchainAsset: string;
  offchainAccount: string;
  rate: string;  // use 18 decimals
  state: State;
  chain: Chain;
}
