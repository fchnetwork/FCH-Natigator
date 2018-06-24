import { BigNumber } from "bignumber.js";

export function fromSolidityDecimalString(value: string, decimals: number): number {
  if(!value) {
    return 0;
  }

  if(!decimals) {
    return Number(value);
  }

  return new BigNumber(value, 10).div(Math.pow(10, Number(decimals))).toNumber();
}

export function toBigNumberString(value: number): string {
  if(!value) {
    return '0';
  }

  return new BigNumber(value, 10).toString(10);
}

export function toSolidityDecimalString(value: number, decimals = 0): string {
  if(!value) {
    return '0';
  }

  return toBigNumberString(Math.ceil(value * Math.pow(10, decimals)));
}
