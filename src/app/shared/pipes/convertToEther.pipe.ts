import { Pipe, PipeTransform } from '@angular/core'; 
import { TransactionServiceService } from '@app/wallet/transaction/services/transaction-service/transaction-service.service';

@Pipe({
  name: 'convertToEther'
})
export class ConvertToEtherPipe implements PipeTransform {

  web3: any;
  coversionRate: number;

  constructor(  _txnSrv: TransactionServiceService ) { 
    this.web3 = _txnSrv.web3;
  }

  transform( amount: any ): any {
      if( amount > 0) {
        this.coversionRate =  this.web3.utils.fromWei( amount.toString(), 'ether')
      } else {
        this.coversionRate = 0;
      }

      return this.coversionRate;
     
  }

}
