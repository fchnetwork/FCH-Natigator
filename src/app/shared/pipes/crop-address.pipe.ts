import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cropAddress'
})
export class CropAddressPipe implements PipeTransform {

  transform(value: string): string {
    if(!value || (value.length < 10)) {
      return value;
    }
    return value.substr(0, 6) + "..."+  value.substr(-4);
  }

}
