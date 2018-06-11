import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

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
    'QUINTILLIONS'
];

  constructor ( private decimalPipe: DecimalPipe,
                private translateService: TranslateService) { }          

  transform(value: number = 0, digits?: any ) : string { 
    if (!isFinite( value ) || value == 0 ){ 
      return '0'; 
    }
    let unit = 0; 
    while ( value > 1000 ) { 
      value /= 1000; 
      unit ++; 
    }
    if (value < 1 && value > 0) {
      while ( value < 1 ) { 
        value *= 10; 
        unit ++;
      }
      return this.decimalPipe.transform(value, digits) + 'e-' + unit;
    } else {
      return this.decimalPipe.transform(value, digits) + ' ' + this.translateService.instant('BIG_NUMBERS.' + this.units[ unit ]);
    }
  }

}
