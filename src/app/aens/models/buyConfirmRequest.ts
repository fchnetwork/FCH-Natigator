export class BuyConfirmRequest {
    buyer: string;
    ansOwner: string;
    amount: number;
    estimatedFeeInGas: number;
    maximumFeeInGas: number;
    gasPrice: number;
}