import { Injectable } from '@angular/core';
var bigInt = require("big-integer");

@Injectable()
export class BigNumbersService {

    constructor() { }

    /**
     *Converts a bigInt into a native Javascript number. Loses precision for numbers outside the range [-9007199254740992, 9007199254740992]
     *
     * @param bigNumber
     * @returns
     * @memberof BigNumbersService
     */
    toJSNumber(operand) {
        return bigInt(operand).toJSNumber();
    }

    /**
     *Converts a bigInt to a string. There is an optional radix parameter (which defaults to 10) that converts the number to the given radix. Digits in the range 10-35 will use the letters a-z.
     *
     * @param operand e.g. "5e55"
     * @param {number} [radix=10] e.g. 2, 10, 16 and etc.
     * @returns string representation of big number
     * @memberof BigNumbersService
     */
    toString(operand, radix = 10) {
        return bigInt(operand).toString(radix);
    }

    /**
     * Performs addition.
     *
     * @param {*} firstOperand first operand of addition. Can be big number.
     * @param {*} secondOpenrand second operand of addition. Can be big number.
     * @returns
     * @memberof BigNumbersService
     */
    plus(firstOperand, secondOpenrand) {
        return bigInt(firstOperand).add(bigInt(secondOpenrand));
    }

    /**
     * Performs multiplication.
     *
     * @param {*} firstOperand first operand of multiplication. Can be big number.
     * @param {*} secondOpenrand second operand of multiplication. Can be big number.
     * @returns
     * @memberof BigNumbersService
     */
    multiply(firstOperand, secondOperand) {
        return bigInt(firstOperand).multiply(bigInt(secondOperand));
    }

    /**
     * Performs exponentiation. If the exponent is less than 0, pow returns 0. bigInt.zero.pow(0) returns 1.
     *
     * @param {*} operand operand of exponentiation.
     * @param {*} power 
     * @returns
     * @memberof BigNumbersService
     */
    pow(operand, power) {
        return bigInt(operand).pow(power);
    }

    divide(firstOperand, secondOperand) {
        return bigInt(firstOperand).divide(bigInt(secondOperand));
    }

}
