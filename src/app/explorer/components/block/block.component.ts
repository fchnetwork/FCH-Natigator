import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ExplorerService } from '../../services/explorer.service'
import { iBlocks, iTransaction } from '../../../shared/app.interfaces'

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {

  block: Array<iBlocks> = [];
  blockNumber: number;
  demo: string;
  transactions: Array<iTransaction>;

  constructor(
    private _ngZone: NgZone,
    public exploreSrv: ExplorerService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.blockNumber = params['id'];
        this.transactions = [];
        this.getBlock()
      });
  } 


  getBlock() {
    this.exploreSrv.web3.eth.getBlock( this.blockNumber, (error, result) => {
      if( !error && result !== null) {
        this.block = result;
        this.getBlockTransactions( this.block)
        this.cd.markForCheck();
      } else {
        alert(`${this.blockNumber} is not valid - ${error}`)
      }
    })
  }


getBlockTransactions(blockData) {
  this.exploreSrv.web3.eth.getBlockTransactionCount( blockData['number'], (error, result) => {
  let txCount = result
   for ( let blockIdx = 0; blockIdx < txCount; blockIdx++) {
     this.exploreSrv.web3.eth.getTransactionFromBlock( blockData['number'], blockIdx, (error, txn) => {
     //  console.log( JSON.stringify(txn, null,2 ) )
       this.transactions.push(txn);
     })
   }
})
}


  inspectAddress( address: string ){
    this.router.navigate(['/explorer/address', address ], { relativeTo: this.route });
  }


}

