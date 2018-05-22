import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { iTransaction, iBlocks } from '@shared/app.interfaces';
import { setInterval } from 'timers';
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { ExplorerService } from '@app/core/explorer/explorer-service/explorer.service';
import { LoaderService } from '@app/core/general/loader-service/loader.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html'
})
export class BlocksComponent implements AfterViewInit, OnDestroy {

  blocks: any[] = [];
  maxBlocks: number = 10;

  lowBlock: number;
  highBlock: number;
  countblocks: number;

  order: number;
  column: string = 'number';
  descending: boolean = false;

  getBlockSource: Subscription;
  getLatestBlockSource: Subscription;

  constructor(
    public exploreSrv: ExplorerService,
    private router: Router,
    private modal: ModalService,
    public loaderService: LoaderService) { }

  ngAfterViewInit() {
    this.loaderService.toggle(true);
    // First get the latest block number
    this.getLatestBlockSource = this.exploreSrv.getLatestBlockNumber().subscribe(latestBlockNumber => {
      this.highBlock = latestBlockNumber;
      this.loadBlocks();
    });
  }

  ngOnDestroy() {
    this.getBlockSource.unsubscribe();
    this.getLatestBlockSource.unsubscribe();
  } 

  loadBlocks() {
    this.loaderService.toggle(true);
    this.getBlockSource = this.exploreSrv.getBlocks(this.highBlock, this.maxBlocks).finally(() => {
      this.loaderService.toggle(false)
    }).subscribe(blockList => { 
      this.blocks = this.blocks.concat(blockList.blocks);        
      this.highBlock = blockList.highBlock - 1;
    });
  }

  

  openBlock(block: iBlocks) {
    this.modal.openBlock(block.number, block).then(result => {
    }).catch(err => console.log('block component ' + err));
  }
}
