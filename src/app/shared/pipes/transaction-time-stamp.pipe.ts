import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'transactionTimeStamp'
})
export class TransactionTimeStampPipe implements PipeTransform {
  transform( timestamp: number, ...args) {

    const timePassed =  moment.unix(timestamp).format('dddd, MMMM Do, YYYY h:mm:ss A');
     
    return timePassed; 
  }
}
