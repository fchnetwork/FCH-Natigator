export class SetAddressConfirmRequest {
    name: string;
    oldAddress: string;
    newAddress: string;
    estimatedFeeInGas: number;
    maximumFeeInGas: number;
    gasPrice: number;
}
