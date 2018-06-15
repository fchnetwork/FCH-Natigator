import { EthWalletType } from "@external/models/eth-wallet-type.enum";

export interface SwapReference {
  hash: string;
  secret: string;
  counterparty: string;
  account: string;
  ethAmount: number;
  token: string;
  tokenAmount: number;
  walletType: EthWalletType;
  timelock: number;
}
