import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BigNumbersService } from "@core/general/big-numbers-service/big-numbers.service";

@Pipe({
  name: 'bignumber'
})
export class BigNumbersPipe implements PipeTransform {
  private units = [
    'NO_UNIT',
    'THOUSANDS',
    'MILLIONS',
    'BILLIONS',
    'TRILLIONS',
    'QUADRILLIONS',
    'QUINTILLIONS',
    "SEXTILLION",
    "SEPTILLION",
    "OCTILLION",
    "NONILLION",
    "DECILLION"
];

  constructor ( private decimalPipe: DecimalPipe,
                private translateService: TranslateService,
                private bigNumbersService: BigNumbersService) { } 
              
  isFloat(n){
    return Number(n) === n && n % 1 !== 0;
  }          

  transform(value: number = 0, digits?: any ) : string {
    if (value > 1e33) {
      return this.bigNumbersService.toJSNumber(value).toPrecision(3);
    }
    if (!isFinite( value ) || value == 0 ){ 
      return '0'; 
    }
    let unit = 0; 
    while ( value > 1000 ) { 
      value /= 1000; 
      unit ++; 
    }
    if (value < 1 && value >= 0.000001) {
      return this.decimalPipe.transform(value, '.7');
    } else if (value < 1 && value > 0) {
      while ( value < 1) { 
        value *= 10; 
        unit ++;
      }
      return this.decimalPipe.transform(value, digits) + 'e-' + unit;
    } 
    else {
      return this.decimalPipe.transform(value, digits) + ' ' + this.translateService.instant('BIG_NUMBERS.' + this.units[ unit ]);
    }
  }

}
