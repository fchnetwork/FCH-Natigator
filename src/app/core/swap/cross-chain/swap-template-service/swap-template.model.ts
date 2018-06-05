import { Chain } from "./chain.enum";

export class SwapTemplate {
  id: string;
  owner: string;
  onchainAsset: string;
  onchainAccount: string;
  offchainAsset: string;
  offchainAccount: string;
  rate: number;  // use 18 decimals
  chain: Chain;
}
