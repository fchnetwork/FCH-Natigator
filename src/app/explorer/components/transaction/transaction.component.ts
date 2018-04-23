import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ExplorerService } from '../../services/explorer.service';
import { iTransaction } from '../../../shared/app.interfaces';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  txn: iTransaction;

  constructor( private _ngZone: NgZone,
    public exploreSrv: ExplorerService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router ) { }

    ngOnInit() {
      this.route.params.subscribe(params => {
          this.txn = params['id'];
          this.findTransaction();
        });
    }

  findTransaction(){
    this.exploreSrv.web3.eth.getTransaction( this.txn, (error, result) => {
      if( !error && result !== null) {
        this.txn = result;
        this.cd.markForCheck();
      } else {
        alert(`${this.txn} is not valid - ${error}`);
      }
    });
  }



  inspectBlock( blockNumber: number ) {
    this.router.navigate(['/explorer/block', blockNumber ], { relativeTo: this.route });
  } 

  inspectAddress( address: string ){
    this.router.navigate(['/explorer/address', address ], { relativeTo: this.route });
  }

  inspectTransaction( transaction: string ){
      this.router.navigate(['/explorer/transaction', transaction ], { relativeTo: this.route });
  }




}
