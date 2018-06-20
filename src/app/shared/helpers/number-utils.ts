export function toNumber(value: string, decimals: number): number {
  if(!value) {
    return 0;
  }

  if(!decimals) {
    return Number(value);
  }

  return Number(value) / Math.pow(10, Number(decimals));
}
