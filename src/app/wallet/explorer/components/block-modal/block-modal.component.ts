import { Component, OnInit } from '@angular/core';
import { iBlocks } from '@app/shared/app.interfaces';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { EnvironmentService } from "@core/general/environment-service/environment.service";
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
              public notificationService: InternalNotificationService,
              private environment: EnvironmentService,
              private translateService: TranslateService) {

  }

  ngOnInit() {
  }

  copyToClipboard(hash) {
    this.clipboardService.copy(hash);
    this.notificationService.showMessage(this.translateService.instant('COPIED_TO_CLIPBOARD'), this.translateService.instant('DONE'));
  }

  openBlock(blockNumber) {
    window.open( this.environment.get().externalBlockExplorer + 'block/' + blockNumber, "_blank");
  }
}
