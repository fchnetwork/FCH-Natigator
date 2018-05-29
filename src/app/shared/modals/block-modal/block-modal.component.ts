import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog'; 
import { iBlocks } from '@app/shared/app.interfaces';
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { environment } from '@env/environment';

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

  constructor(public dialog: DialogRef<BlockModalContext>,
              public clipboardService: ClipboardService,
              public notificationService: InternalNotificationService) {
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

  copyToClipboard(hash) {
    this.clipboardService.copy(hash);
    this.notificationService.showMessage('Copied to clipboard!', 'Done');
  }

  openBlock(blockNumber) {
    window.open( environment.externalBlockExplorer + 'block/' + blockNumber, "_blank");
  }
}
