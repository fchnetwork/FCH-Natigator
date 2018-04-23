import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ExplorerService } from '@explorer/services/explorer.service';
import { iBlocks, iTransaction } from '@shared/app.interfaces';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  block: any;
  blockNumber: number;
  demo: string;
  transactions: iTransaction[];

  constructor(
    public exploreSrv: ExplorerService,
    private route: ActivatedRoute,
    private router: Router ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.blockNumber = params['id'];
        this.transactions = [];
        this.getBlock();
      });
  } 


  getBlock() {
    this.exploreSrv.web3.eth.getBlock( this.blockNumber, (error, result) => {
      if( !error && result !== null) {
        this.block = result;
        this.getBlockTransactions( this.block);
      } else {
        alert(`${this.blockNumber} is not valid - ${error}`);
      }
    });
  }


getBlockTransactions(blockData) {
  this.exploreSrv.web3.eth.getBlockTransactionCount( blockData['number'], (error, result) => {
  const txCount = result;
   for ( let blockIdx = 0; blockIdx < txCount; blockIdx++) {
     this.exploreSrv.web3.eth.getTransactionFromBlock( blockData['number'], blockIdx, (error, txn) => {
       this.transactions.push(txn);
     });
   }
});
}


  inspectAddress( address: string ){
    this.router.navigate(['/explorer/address', address ], { relativeTo: this.route });
  }


}

