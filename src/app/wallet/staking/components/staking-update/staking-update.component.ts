import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-staking-update',
  templateUrl: './staking-update.component.html',
  styleUrls: ['./staking-update.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StakingUpdateComponent implements OnInit {

  increaseAmount: number;
  decreaseAmount: number;

  delegeteAddress = '0xe64db9af28b11d945c4f18aff7020c80c6656009';

  constructor() { }

  ngOnInit() {
  }

  increaseStaking() {

  }

  decreaseStaking() {
    
  }

}
