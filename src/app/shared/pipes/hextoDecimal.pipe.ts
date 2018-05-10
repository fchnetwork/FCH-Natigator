import { Pipe, PipeTransform } from '@angular/core';  
import { TransactionService } from '@app/core/transaction-service/transaction-service.service';

@Pipe({
  name: 'hextoDecimal'
})
export class HextoDecimalPipe implements PipeTransform {

  web3: any;
  plainText: string;

  constructor(  _txnSrv: TransactionService ) { 
    this.web3 = _txnSrv.web3;
  }

  transform( hex: string ): string {
    if( hex ) {
      this.plainText =  this.web3.utils.toDecimal( hex );
    } else {
      this.plainText = "";
    }
    return this.plainText;
  }

}


