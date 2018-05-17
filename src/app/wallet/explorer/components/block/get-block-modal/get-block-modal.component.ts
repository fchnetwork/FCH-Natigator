import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { iBlocks } from '@shared/app.interfaces';   
import { ExplorerService } from '@app/core/explorer/explorer-service/explorer.service';

export interface BlockModalContext {
  blockNumber?: number;
  block?: iBlocks;
}
@Component({
  selector: 'app-get-block-modal',
  templateUrl: './get-block-modal.component.html',
  styleUrls: ['./get-block-modal.component.scss']
})

export class GetBlockModalComponent implements OnInit, ModalComponent<BlockModalContext> {
  blockNumber: number;
  block: iBlocks;
  constructor( public exploreSrv: ExplorerService, public dialog: DialogRef<BlockModalContext>) {
    this.exploreSrv.web3.eth.getBlock( dialog.context.blockNumber, (error, result) => {
      if(!error) {
        this.block = result
      }
    })
  }
  
  ngOnInit() {
  }

  dismiss(): void {
    this.dialog.dismiss();
  }

  close(): void {
    this.dialog.close();
  }
}
