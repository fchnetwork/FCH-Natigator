import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { BasicModalContext } from '@app/shared/components/modals/basic-modal/basic-modal.component';

@Component({
  selector: 'app-create-swap-confirm',
  templateUrl: './create-swap-confirm.component.html',
  styleUrls: ['./create-swap-confirm.component.scss']
})
export class CreateSwapConfirmComponent implements ModalComponent<BasicModalContext>, OnInit {

  param: any;

  constructor(public dialog: DialogRef<BasicModalContext>) { 
    this.param = dialog.context.param;
  }

  ngOnInit() {
  }

  onCreate() {
    this.dialog.close({confirmed: true});
  }

  onCancel() {
    this.dialog.close({confirmed: false});
  }
}
