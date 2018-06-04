import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'bignumber'
})
export class BigNumbersPipe implements PipeTransform {
  private units = [
    '',
    '',
    'Millions',
    'Billions',
    'Trillions',
    'Quadrillions',
    'Quintillions'
];

  constructor(private decimalPipe: DecimalPipe) {

  }
  transform(value: any, decimals:any, digits?: any): any {
    if (value >= 10**6 && value < 10**9) {
      return this.decimalPipe.transform(value/(10**6), digits) + ' Millions';
    } else if (value >= 10**9 && value < 10**12) {
      return this.decimalPipe.transform(value/(10**9), digits) + ' Billions';
    } else if (value >= 10**12 && value < 10**15) {
      return this.decimalPipe.transform(value/(10**12), digits) + ' Trillions';
    } else if (value >= 10**15) {
      return this.decimalPipe.transform(value/(10**15), digits) + ' Quadrillions';
    } else if (value < 1 && value >0) {
      return this.decimalPipe.transform(value*(10**decimals), digits) + 'e-' + decimals;
    } else {
      return this.decimalPipe.transform(value, '1.0')
    }
  }
  // transform(value: number = 0, precision?: number ) : string { 
  //   if (!isFinite( value ) ){ 
  //     return '?'; 
  //   } 
  //   let unit = 0; 
  //   while ( value >= 1000 ) { 
  //     value /= 1000; 
  //     unit ++; 
  //   }
  //   return value.toFixed( + precision ) + ' ' + this.units[ unit ];
  // }

}
