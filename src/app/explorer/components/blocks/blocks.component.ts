import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ExplorerService } from '@explorer/services/explorer.service';
import { iTransaction, iBlocks } from '@shared/app.interfaces';
import { ModalService } from '@shared/services/modal.service';


@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html'
})
export class BlocksComponent implements OnInit {

  blocks: iBlocks[];
  maxBlocks: number = 150;

  lowBlock: number;
  highBlock: number;
  countblocks: number;

  constructor(
    public exploreSrv: ExplorerService,
    private router: Router,
    private modal: ModalService) {}

  ngOnInit() {
    this.blocks = [];
    this.exploreSrv.getBlock().subscribe( async currentBlock => {
      for (var i = 0; i < this.maxBlocks; ++i) {
          this.exploreSrv.web3.eth.getBlock( currentBlock - i, (error, result) => {
            if(!error) {
              this.blocks.push(result );  
              this.lowBlock    = this.blocks[0].number;
              this.highBlock   = this.blocks[this.blocks.length-1].number;
              this.countblocks = this.blocks.length;
            }
          })
      }
    });
  }


  openBlock(block: iBlocks) {
    this.modal.openBlock(block.number,block).then( result => {

      console.log("result"+ JSON.stringify( result ) )

    }).catch( err => console.log('block component ' + err ) );
  }


}
