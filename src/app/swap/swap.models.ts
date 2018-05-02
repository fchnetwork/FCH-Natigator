import { TransactionReceipt } from "web3/types";

export interface SwapToken {
    address: string;
    decimals?: number;
    symbol: string;
}

export type SwapMode = 'aero_to_erc20'|'erc20_to_aero'|'erc20_to_erc20'|'aero_to_aero';

export interface SwapManager {
    closeSwap(swapId: string) : Promise<TransactionReceipt>;
    expireSwap(swapId: string) : Promise<TransactionReceipt>;
    checkSwap(swapId: string) : Promise<any>;
}

export interface LoadedSwap {
    swapId: string;
    tokenAmount: string;
    tokenTrader: string;
    tokenAddress: string;
    counterpartyAmount: string;
    counterpartyTrader: string;
    counterpartyTokenAddress: string;
    status: SwapStatus;
}

export type SwapStatus = 'Invalid' | 'Open' | 'Closed' | 'Expired';