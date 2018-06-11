export interface Token {
  address: string;
  symbol: string;
  decimals: string; // for now it's stored as string
  balance: number;
}
