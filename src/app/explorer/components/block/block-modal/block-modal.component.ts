import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { iBlocks } from '../../../../shared/app.interfaces';

export interface BlockModalContext {
  blockNumber?: number;
  block?: iBlocks;
}

@Component({
  selector: 'app-block-modal',
  templateUrl: './block-modal.component.html',
  styleUrls: ['./block-modal.component.scss']
})
export class BlockModalComponent implements OnInit, ModalComponent<BlockModalContext> {

  blockNumber: number;
  block: iBlocks;

  constructor(public dialog: DialogRef<BlockModalContext>) {
    if(dialog.context.blockNumber) {
      this.blockNumber = dialog.context.blockNumber;
    }
    if(dialog.context.block) {
      this.block = dialog.context.block;
    }
    else {
      // GET BLOCK via blockNumber or id or define it
    }
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
