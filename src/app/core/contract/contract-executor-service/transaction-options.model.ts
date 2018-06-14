export interface TransactionOptions {
  value?: string;
  hashReceivedCallback?: (hash: string) => void;
}
