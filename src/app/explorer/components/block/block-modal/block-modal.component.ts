import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';

export interface BlockModalContext {
  blockNumber?: number;
}

@Component({
  selector: 'app-block-modal',
  templateUrl: './block-modal.component.html',
  styleUrls: ['./block-modal.component.scss']
})
export class BlockModalComponent implements OnInit, ModalComponent<BlockModalContext> {

  blockNumber: number;

  constructor(public dialog: DialogRef<BlockModalContext>) {
    if(dialog.context.blockNumber) {
      this.blockNumber = dialog.context.blockNumber;
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
