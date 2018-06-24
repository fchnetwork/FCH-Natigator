import { EthWalletType } from "@external/models/eth-wallet-type.enum";

export interface TransactionOptions {
  account: string;
  wallet: EthWalletType;
  hashCallback?: (hash: string) => void;
}
