import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { SwapType } from "@core/swap/models/swap-type.enum";

export interface SwapReference {
  hash: string;
  secret: string;
  account: string;
  opened: number;
  walletType: EthWalletType;
  walletTokenAddress: string;
  walletTokenSymbol: string;
  token: string;
  tokenAmount: number;
  erc20Amount?: number;
  ethAmount?: number;
  swapType: SwapType;
}
