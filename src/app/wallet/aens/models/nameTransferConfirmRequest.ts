export class NameTransferConfirmRequest {
    name: string;
    newOwner: string;
    estimatedFeeInGas: number;
    maximumFeeInGas: number;
    gasPrice: number;
}
