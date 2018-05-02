import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { BasicModalContext } from '@app/shared/components/modals/basic-modal/basic-modal.component';
import { LoadedSwap } from '@app/swap/swap.models';

@Component({
  selector: 'app-load-swap-confirm',
  templateUrl: './load-swap-confirm.component.html',
  styleUrls: ['./load-swap-confirm.component.scss']
})
export class LoadSwapConfirmComponent implements ModalComponent<BasicModalContext>, OnInit {

  param: LoadedSwap;

  constructor(public dialog: DialogRef<BasicModalContext>) { 
    this.param = dialog.context.param;
  }

  ngOnInit() {
  }

  onConfirm() {
    this.dialog.close({confirmed: true, rejected: false});
  }

  onReject() {
    this.dialog.close({confirmed: false, rejected: true});
  }

  onCancel() {
    this.dialog.close({confirmed: false, rejected: false});
  }
}
