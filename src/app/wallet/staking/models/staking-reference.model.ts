import { EthWalletType } from "@app/external/models/eth-wallet-type.enum";

export class StakingReference {
  address: string;
  delegate: string;
  walletType: EthWalletType;
}