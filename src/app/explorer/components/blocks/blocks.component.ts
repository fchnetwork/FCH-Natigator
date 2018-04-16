import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ExplorerService } from '../../services/explorer.service';
import { iTransaction, iBlocks } from '../../../shared/app.interfaces';
import { ModalService } from '../../../shared/services/modal.service';


@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html'
})
export class BlocksComponent implements OnInit {

  blocks: iBlocks[];
  maxBlocks: number;

  constructor(
    private _ngZone: NgZone,
    public exploreSrv: ExplorerService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private modal: ModalService
  ) { }

  ngOnInit() {
    this.blocks = [];
    this.loadBlocks();
    this.maxBlocks = this.blocks.length;
  }

  private loadBlocks() {
    // demoBlocks
    const demoBlocks: iBlocks = {
      "difficulty": '13546847',
      "extraData": '0x0110101010100010101',
      "gasLimit": 8000000,
      "gasUsed": 7564321,
      "hash": '0xa6sfd54a6dsf54a6sdf',
      "logsBloom": '...',
      "miner": '0xsad6f54as6fd54saf6a5sfd4',
      "mixHash": '0xa6sfd54a6dsf54a6sdf',
      "nonce": '254',
      "number": 5426093,
      "parentHash": '0xa6sfd54a6dsf54a6sdf',
      "receiptsRoot": '...',
      "sha3Uncles": '...',
      "size": 756,
      "stateRoot": '...',
      "timestamp": 1520373465,
      "totalDifficulty": '102723',
      "transactions": [''],
      "transactionsRoot": '...',
      "uncles": ['']
    };

    for(let i=0; i<7; i++) {
      this.blocks.push(demoBlocks);
    }

    //TODO: this must call exploreService
  }

  getLowestBlockNumber() {
    return this.blocks[0].number;
  }

  getHighestBlockNumber() {
    return this.blocks[this.blocks.length-1].number;
  }

  getBlocksCount() {
    return this.blocks.length;
  }

  openBlock(block: iBlocks) {
    this.modal.openBlock(block.number ,block).then(result => {
    }).catch(()=>{});
  }

  getBlockAge(block: iBlocks) {
    //return Date.now - Number(block.timestamp);
    return 1;
  }
}
