import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'transactionTimeAgo'
})
export class TransactionTimeAgoPipe implements PipeTransform {

  transform( timestamp: number, ...args) {

    const timePassed =  moment.unix(timestamp).fromNow();
     
    return timePassed; 
  }
}
