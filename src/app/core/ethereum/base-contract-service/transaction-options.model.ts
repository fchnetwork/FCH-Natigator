import { EthWalletType } from "@external/models/eth-wallet-type.enum";

export interface TransactionOptions {
  account: string;
  wallet: EthWalletType;
  approveCallback?: (hash: string) => void;
  hashCallback?: (hash: string) => void;
}
