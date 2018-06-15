import { EthWalletType } from "@external/models/eth-wallet-type.enum";

export interface SwapReference {
  hash: string;
  secret: string;
  amount: number;
  counterparty: string;
  account: string;
  token: string;
  walletType: EthWalletType;
  timelock: number;
}
