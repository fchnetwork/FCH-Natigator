import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  
  delimiter = '...';

  transform(value: string, lenght = 0): string {
    if(!value || !lenght) {
      return value;
    }

    if(value.length <= (lenght + this.delimiter.length)) {
      return value;
    }

    const oneSideCount =  Math.ceil((lenght - this.delimiter.length) / 2);
    const left = value.slice(0, oneSideCount);
    const right = value.slice(value.length - oneSideCount - 1);
    return left + this.delimiter + right;
  }
}
