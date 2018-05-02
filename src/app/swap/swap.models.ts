export interface SwapToken {
    address: string;
    decimals?: number;
    symbol: string;
}

export type SwapMode = 'aero_to_erc20'|'erc20_to_aero'|'erc20_to_erc20'|'aero_to_aero';