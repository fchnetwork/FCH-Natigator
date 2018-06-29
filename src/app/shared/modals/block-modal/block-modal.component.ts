import { Component, OnInit } from '@angular/core';
import { iBlocks } from '@app/shared/app.interfaces';
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { environment } from '@env/environment';
import {DialogRef, ModalViewComponent} from '@aerum/ui';

export class BlockModalData {
  blockNumber?: number;
  block?: iBlocks;
}

@Component({
  selector: 'app-block-modal',
  templateUrl: './block-modal.component.html',
  styleUrls: ['./block-modal.component.scss']
})
export class BlockModalComponent implements OnInit, ModalViewComponent<BlockModalData, any> {

  constructor(public dialogRef: DialogRef<BlockModalData, any>,
              public clipboardService: ClipboardService,
              public notificationService: InternalNotificationService) {

  }

  ngOnInit() {
  }

  copyToClipboard(hash) {
    this.clipboardService.copy(hash);
    this.notificationService.showMessage('Copied to clipboard!', 'Done');
  }

  openBlock(blockNumber) {
    window.open( environment.externalBlockExplorer + 'block/' + blockNumber, "_blank");
  }
}
