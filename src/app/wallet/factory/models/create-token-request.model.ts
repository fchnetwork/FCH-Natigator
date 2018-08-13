export interface CreateTokenRequest {
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
  ansName: string;
  estimatedFeeInGas: number;
  maximumFeeInGas: number;
  gasPrice: number;
}
