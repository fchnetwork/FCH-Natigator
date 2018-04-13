import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';  

import { ExplorerService } from '../../services/explorer.service';
import { iBlocks, iTransaction } from '../../../shared/app.interfaces';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})

export class TransactionsComponent implements OnInit {

  currentBlock: number;
  blocks: Array<iBlocks>;
  maxBlocks: number;

  // TRANSACTIONS SCREEN NEED THESE VARIABLE
  transactions: Array<iTransaction>;
     
  constructor( private _ngZone: NgZone,
               public exploreSrv: ExplorerService,
               private cd: ChangeDetectorRef,
               private route: ActivatedRoute,
               private router: Router ) { }

  ngOnInit() {
    this.blocks = [];
    this.transactions = [];
    this.maxBlocks = 50;
    
    let demoTransaction: iTransaction = {
      "blockHash": '0x7aaBfCB2d414f884a48b88015b9021080E3760A9',
      "blockNumber": 5260128,
      "from": '0x1234fCB2d414f884a48b88015b9021080E3760A9',
      "gas": 28,
      "gasPrice": '0.000861',
      "hash": '0x9876fCB2d414f884a48b88015b9021080E3760A9',
      "input": '...',
      "nonce": 3,
      "to": '0x7543fCB2d414f884a48b88015b9021080E3760A9',
      "transactionIndex": 123456,
      "value": '0.001138',
      "v": '...',
      "r": '...',
      "s": '...'
    };
    
    for(let i=0; i<7; i++) {
      this.transactions.push(demoTransaction);
    }
    
    
    /* THIS WAS COMMENTED TEMPORALY */

    // this.exploreSrv.createAccounts()
    
    
    //   this._ngZone.run(() => { 
    //     this.exploreSrv.getBlock().subscribe( async res => {
    //       this.currentBlock = res;
    //         for (var i = 0; i < this.maxBlocks; ++i) {
    //             this.exploreSrv.web3.eth.getBlock( this.currentBlock - i, (error, result) => {
    //               if(!error) {
    //                 this.blocks.push( result );        
    //               }
    //             })
    //         }
    //         this.cd.markForCheck();
    //     });
    //   });
  }



  search(item: any) {
    if( /[a-z]/i.test(item)  ) {

       item = item.split('0x').join('');

       if ( item.length == 40 ) {
          alert("address")
       } else if( item.length === 64 && /[0-9a-zA-Z]{64}?/.test(item) ) {
        alert("txn")
       }

    } else if ( /[0-9]{1,7}?/.test(item)) {
      alert('block Found' + parseInt(item) )
    } else {
      alert(`Error: ${item} is not a valid Block, Address or Transaction`);
    }

  }
 


  exploreBlock(id: number) {
    this.router.navigate(['/explorer/block', id]);
  }


}
