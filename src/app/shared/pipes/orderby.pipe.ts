import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderby',
})
export class OrderbyPipe implements PipeTransform {
  transform(array: Array<string>, args?: any): Array<string> {
    console.log("array"+array)
    return [].slice.call(array).sort( (a, b) => {
      if(a[args.property] < b[args.property]){
          return -1 * args.order;
      }
      else if( a[args.property] > b[args.property]){
          return 1 * args.order;
      }
      else{
          return 0;
      }
    });
  }
}

