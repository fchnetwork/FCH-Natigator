export function toNumber(value: string, decimals: number): number {
  if(!value) {
    return 0;
  }

  if(!decimals) {
    return Number(value);
  }

  return Number(value) / Math.pow(10, Number(decimals));
}

export function toSolidityDecimal(value: number, decimals = 0): string {
  if(!value) {
    return '0';
  }

  return Math.ceil(value * Math.pow(10, decimals)).toString(10);
}
