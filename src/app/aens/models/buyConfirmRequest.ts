export class BuyConfirmRequest {
    name: string;
    buyer: string;
    ansOwner: string;
    amount: number;
    estimatedFeeInGas: number;
    maximumFeeInGas: number;
    gasPrice: number;
}