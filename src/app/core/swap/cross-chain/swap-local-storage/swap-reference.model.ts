import { EthWalletType } from "@external/models/eth-wallet-type.enum";

export interface EtherSwapReference {
  hash: string;
  secret: string;
  account: string;
  walletType: EthWalletType;
  token: string;
  tokenAmount: number;
}
