export interface CreateTokenRequest {
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
  estimatedFeeInGas: number;
  maximumFeeInGas: number;
  gasPrice: number;
}
