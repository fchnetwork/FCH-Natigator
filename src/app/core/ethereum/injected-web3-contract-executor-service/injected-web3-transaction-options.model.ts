export interface InjectedWeb3TransactionOptions {
  value?: string;
  hashReceivedCallback?: (hash: string) => void;
  account: string;
}
