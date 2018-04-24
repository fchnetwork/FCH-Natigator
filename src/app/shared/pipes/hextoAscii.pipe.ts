import { Pipe, PipeTransform } from '@angular/core';
import { TransactionServiceService } from '@transaction/services/transaction-service/transaction-service.service'

@Pipe({
  name: 'hextoAscii'
})
export class HextoAsciiPipe implements PipeTransform {

  web3: any;
  plainText: string;

  constructor(  _txnSrv: TransactionServiceService ) { 
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


