import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { iTransaction, iBlocks } from '@shared/app.interfaces';
import { setInterval } from 'timers';
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { ExplorerService } from '@app/core/explorer/explorer-service/explorer.service';
import { LoaderService } from '@app/core/general/loader-service/loader.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html'
})
export class BlocksComponent implements AfterViewInit {
  blocks: any[] = [];
  maxBlocks: number = 20;
  highBlock: number;

  constructor(
    public exploreSrv: ExplorerService,
    private router: Router,
    private modal: ModalService,
    public loaderService: LoaderService) { }

  ngAfterViewInit() {
    this.loaderService.toggle(true);
    // First get the latest block number
    this.exploreSrv.getLatestBlockNumber().then(latestBlockNumber => {
      this.highBlock = latestBlockNumber;
      this.loadBlocks();
    });
  }

  loadBlocks() {
    this.loaderService.toggle(true);
    this.exploreSrv.getBlocks(this.highBlock, this.maxBlocks).then(blockList => {
        this.loaderService.toggle(false) 
        this.blocks = this.blocks.concat(blockList.blocks);
        this.highBlock = blockList.highBlock - 1;
      });
  }

  openBlock(block: iBlocks) {
    this.modal.openBlock(block.number, block).then(result => {
    }).catch(err => console.log('block component ' + err));
  }
}
