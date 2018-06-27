export interface SwapToken {
    address: string;
    decimals?: number;
    symbol: string;
}

export type SwapMode = 'aero_to_erc20'|'erc20_to_aero'|'erc20_to_erc20'|'aero_to_aero'|'unknown';

export interface LoadedSwap {
    swapId: string;
    tokenAmount: string;
    tokenAmountFormatted: number;
    tokenTrader: string;
    tokenAddress: string;
    tokenInfo?: any,
    counterpartyAmount: string;
    counterpartyAmountFormatted: number;
    counterpartyTrader: string;
    counterpartyTokenAddress: string;
    counterpartyTokenInfo?: any,
    status: SwapStatus;
}

export type SwapStatus = 'Invalid' | 'Open' | 'Closed' | 'Expired';
