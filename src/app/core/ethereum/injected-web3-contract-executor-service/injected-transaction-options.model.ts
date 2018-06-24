export interface InjectedTransactionOptions {
  value?: string;
  hashReceivedCallback?: (hash: string) => void;
  account: string;
}
