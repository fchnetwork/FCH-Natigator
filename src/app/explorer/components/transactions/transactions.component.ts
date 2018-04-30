import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';  

import { ExplorerService } from '../../services/explorer.service';
import { iBlocks, iTransaction } from '../../../shared/app.interfaces';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})

export class TransactionsComponent implements OnInit {

  transactionsFound: number;
  transactions: iTransaction[];
     
  order: number;
  column: string = 'timestamp';
  descending: boolean = false;
  transactionStatus: boolean = false;


  constructor( public exploreSrv: ExplorerService,
               private route: ActivatedRoute,
               private router: Router,
               private modal: ModalService
               ) { }

  ngOnInit() {
    this.getAllTransactions();
  }


  sort(){
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  
  getAllTransactions() {
    this.transactions = [];
    this.exploreSrv.getBlock().subscribe( async currentBlock => {
      for ( let i = currentBlock-400; i < currentBlock; ++i) {
        this.exploreSrv.web3.eth.getBlock(i, (error, blockData) => {
          if( !error && blockData !== null || blockData !== undefined ) {
            this.exploreSrv.web3.eth.getBlockTransactionCount( blockData['number'], (error, txCount) => {
                for ( let blockIdx = 0; blockIdx < txCount; blockIdx++) {
                  this.transactionStatus = true;
                  this.exploreSrv.web3.eth.getTransactionFromBlock( blockData['number'], blockIdx, (error, txn) => {
                  const mergeBlockTransaction = Object.assign( txn, blockData ); // need to merge block info with transaction because we need the block timestamp
                  this.transactions.push(mergeBlockTransaction);
                })
              }
            })
          }
        });
      }
    });
  }
  


  openBlock(blockNumber) {
    this.modal.openBlock(blockNumber).then( result =>{ 
     })
     .catch( () => {});
  }

  openTransaction(transaction) {
    this.modal.openTransaction(transaction.hash, transaction, false, null).then((result) => {
    }).catch( () => {});
  }

  search(item: any) {
    if( /[a-z]/i.test(item)  ) {

       item = item.split('0x').join('');

       if ( item.length == 40 ) {
          alert("address");
       } else if( item.length === 64 && /[0-9a-zA-Z]{64}?/.test(item) ) {
        alert("txn");
       }

    } else if ( /[0-9]{1,7}?/.test(item)) {
      alert('block Found' + parseInt(item) );
    } else {
      alert(`Error: ${item} is not a valid Block, Address or Transaction`);
    }

  }
 


  exploreBlock(id: number) {
    this.router.navigate(['/explorer/block', id]);
  }


}
