import { ModalService } from '@app/core/general/modal-service/modal.service';
import { Component, AfterViewInit } from '@angular/core';
import { iBlocks } from '@shared/app.interfaces';
import { ExplorerService } from '@app/core/explorer/explorer-service/explorer.service';
import { LoaderService } from '@app/core/general/loader-service/loader.service';
import { SettingsService } from '@app/core/settings/settings.service';
import { Router } from '@angular/router';
import { BlockModalData } from '@app/wallet/explorer/components/block-modal/block-modal.component';
import { EnvironmentService } from "@core/general/environment-service/environment.service";

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html'
})
export class BlocksComponent implements AfterViewInit {
  blocks: any[] = [];
  maxBlocks: number;
  highBlock: number;
  perfectScrollbarDisabled: boolean;

  constructor(
    public exploreSrv: ExplorerService,
    private router: Router,
    private modal: ModalService,
    public loaderService: LoaderService,
    private settingsService: SettingsService,
    public modalService: ModalService,
    private environment: EnvironmentService)
  {
    this.maxBlocks = this.settingsService.settings.generalSettings.numberOfBlocks;
    this.perfectScrollbarDisabled = this.environment.get().isMobileBuild;
  }

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
