export interface EthereumTransactionOptions {
  value?: string;
  hashReceivedCallback?: (hash: string) => void;
  account: string;
  privateKey: string;
}
