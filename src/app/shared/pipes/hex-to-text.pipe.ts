import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hexToText'
})
export class HexToTextPipe implements PipeTransform {

  transform( hexString: string ): any {
    if( hexString ) {
      const hex = hexString.toString();
      let str = '';
      for (let i = 0; i < hex.length; i += 2) {
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;      
    }
  }

}
