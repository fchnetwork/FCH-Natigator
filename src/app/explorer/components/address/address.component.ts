import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, Params } from '@angular/router';

import { ExplorerService } from '../../services/explorer.service'

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  address: string;
  balance: string;
  balanceAerum: string;

  constructor( 
    private _ngZone: NgZone,
    public exploreSrv: ExplorerService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router ) { } 


  ngOnInit() {
    this.route.params.subscribe(params => {
        this.address = params['id'];
        this.inspectBalance()
      });
  } 

  inspectBalance() {
    this.exploreSrv.web3.eth.getBalance( this.address, (error, accountBalance) => {
      if(!error) {
          this.balance = accountBalance;
          this.balanceAerum = this.exploreSrv.fromWei( accountBalance, 'ether' );
      } 
    });
  }

}
