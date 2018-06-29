import { BlockModalComponent, BlockModalData } from '@app/shared/modals/block-modal/block-modal.component';
import { Component, AfterViewInit } from '@angular/core';
import { iBlocks } from '@shared/app.interfaces';
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { ExplorerService } from '@app/core/explorer/explorer-service/explorer.service';
import { LoaderService } from '@app/core/general/loader-service/loader.service';


@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html'
})
export class BlocksComponent implements AfterViewInit {
  blocks = [];
  maxBlocks = 20;
  highBlock: number;

  constructor(
    public exploreSrv: ExplorerService,
    private modalService: ModalService,
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
        this.loaderService.toggle(false);
        this.blocks = this.blocks.concat(blockList.blocks);
        this.highBlock = blockList.highBlock - 1;
      });
  }

  async openBlock(block: iBlocks) {
    const data = new BlockModalData();
    data.block = block;
    data.blockNumber = block.number;

    await this.modalService.openBlock(data);
  }
}
