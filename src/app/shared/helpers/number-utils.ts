import { BigNumber } from "bignumber.js";

/**
  * Converts a bigInt into a native Javascript number. Loses precision for numbers outside the range [-9007199254740992, 9007199254740992]
  *
  * @param {*} operand
  * @returns {number}
  * @memberof BigNumbersService
*/
export function bigNumberToNumber(operand) : number {
  return new BigNumber(operand).toNumber();
}

/**
   * Converts a bigInt to a string. There is an optional radix parameter (which defaults to 10) that converts the number to the given radix. Digits in the range 10-35 will use the letters a-z.
   *
   * @param {*} operand e.g. "5e55"
   * @param {number} [radix=10] e.g. 2, 10, 16 and etc.
   * @returns {string} string representation of big number
   * @memberof BigNumbersService
*/
export function bigNumberToString(operand, radix = 10) : string {
  return new BigNumber(operand).toString(radix);
}

/**
  * Performs addition.
  *
  * @param {*} firstOperand first operand of addition. Can be big number.
  * @param {*} secondOpenrand second operand of addition. Can be big number.
  * @returns {BigNumber}
  * @memberof BigNumbersService
*/
export function bigNumbersPlus(firstOperand, secondOpenrand) : BigNumber {
  return new BigNumber(firstOperand).plus(new BigNumber(secondOpenrand));
}

/**
   * Performs multiplication.
   *
   * @param {*} firstOperand first operand of multiplication. Can be big number.
   * @param {*} secondOperand second operand of multiplication. Can be big number.
   * @returns {BigNumber}
   * @memberof BigNumbersService
*/
export function bigNumbersMultiply(firstOperand, secondOperand): BigNumber {
      return new BigNumber(firstOperand).multipliedBy(new BigNumber(secondOperand));
  }

/**
   * Performs exponentiation. If the exponent is less than 0, pow returns 0. bigInt.zero.pow(0) returns 1.
   *
   * @param {*} operand operand of exponentiation.
   * @param {*} power power of exponentiation.
   * @returns {BigNumber}
   * @memberof BigNumbersService
*/
export function bigNumbersPow(operand, power) : BigNumber {
  return new BigNumber(operand).exponentiatedBy(power);
}

/**
  * Performs integer division, disregarding the remainder.
  *
  * @param {*} firstOperand first operand of division. Can be big number.
  * @param {*} secondOperand second operand of division. Can be big number.
  * @returns {BigNumber}
  * @memberof BigNumbersService
*/
export function bigNumbersDivide(firstOperand, secondOperand) : BigNumber {
  return new BigNumber(firstOperand).dividedBy(new BigNumber(secondOperand));
}

/**
   * Returns a number from Solidity decimal string.
   *
   * @param {string} value String value.
   * @param {number} decimals Decimals.
   * @returns {number}
   * @memberof BigNumbersService
*/
export function fromSolidityDecimalString(value: string, decimals: number): number {
  if (!value) {
    return 0;
  }
  if (!decimals) {
    return Number(value);
  }
  return new BigNumber(value, 10).div(Math.pow(10, Number(decimals))).toNumber();
}

/**
   * Returns BigNumber string from given number.
   *
   * @param {number} value BigNumber to stringify.
   * @returns {string}
   * @memberof BigNumbersService
*/
export function toBigNumberString(value: number): string {
  if (!value) {
    return '0';
  }
  return new BigNumber(value, 10).toString(10);
}
    
/**
   * Returns Solidity decimal string from given number.
   *
   * @param {number} value Number to stringify.
   * @param {number} [decimals=0] Decimals.
   * @returns {string}
   * @memberof BigNumbersService
*/
export function toSolidityDecimalString(value: number, decimals = 0): string {
  if (!value) {
    return '0';
  }
  return toBigNumberString(Math.ceil(value * Math.pow(10, decimals)));
}
