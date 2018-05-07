import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';  
import { ExplorerService } from '@explorer/services/explorer.service';
import { iBlocks, iTransaction } from '@shared/app.interfaces';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})

export class TransactionsComponent implements OnInit {

  transactionsFound: number;
  transactions: iTransaction[] = [];
  order: number;
  column: string = 'timestamp';
  descending: boolean = false;
  transactionStatus: boolean = false;

  constructor( public exploreSrv: ExplorerService,
               private route: ActivatedRoute,
               private router: Router,
               private modal: ModalService) {}

  ngOnInit() {
    this.getAllTransactions();
  }

  sort(){
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }
  
  getAllTransactions() {
    const transactions = [];
    let searchAmount = 480;
    this.exploreSrv.getBlock().subscribe( async currentBlock => {      
      let bookmarkCurrenBlock = currentBlock - 1;
      for ( let i = currentBlock - searchAmount; i < currentBlock; ++i) {
        this.exploreSrv.web3.eth.getBlock(i).then( (blockData:any) => {
              return Promise.all([
                  this.exploreSrv.web3.eth.getBlockTransactionCount( blockData['number'] )
              ]).then(results => {
                  for ( let blockIdx = 0; blockIdx < results[0]; blockIdx++) {
                    this.exploreSrv.web3.eth.getTransactionFromBlock( blockData['number'], blockIdx, (error, txn) => {
                      const mergeBlockTransaction = Object.assign( txn, {timestamp: blockData.timestamp}); // need to merge block info with transaction because we need the block timestamp
                      this.transactions.push(mergeBlockTransaction);
                      // TODO: refactor to use pipe for sorting!
                      if(blockIdx === Number(results[0] - 1)){
                        this.transactions = transactions.sort((b,a)=>{
                          const c:any = new Date(a.timestamp);
                          const d:any = new Date(b.timestamp);
                          return c - d;
                          });
                      }
                    });
                }

                this.transactionStatus = ( searchAmount-- == 1) ? true : false;  // show or hide our loader animation - coming soon!! 
              });          
          })
      }
    });
  }

  openBlock(blockNumber) {
    this.modal.openBlock(blockNumber).then( result =>{ 
     }).catch( () => {});
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
