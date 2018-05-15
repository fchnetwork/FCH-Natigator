import { Pipe, PipeTransform } from '@angular/core';  
import { TransactionService } from '@app/core/transaction-service/transaction.service';

@Pipe({
  name: 'hextoAscii'
})
export class HextoAsciiPipe implements PipeTransform {

  web3: any;
  plainText: string;

  constructor(  _txnSrv: TransactionService ) { 
    this.web3 = _txnSrv.web3;
  }

  transform( hex: string ): string {
    if( hex ) {
      this.plainText =  this.web3.utils.toAscii( hex );
    } else {
      this.plainText = "";
    }
    return this.plainText;
  }

}


