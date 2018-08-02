import { EthWalletType } from "@app/external/models/eth-wallet-type.enum";

export class EthereumWalletAccount {
  address: string;
  walletType: EthWalletType;
  ethereumBalance: number;
  aerumBalance: number;
}