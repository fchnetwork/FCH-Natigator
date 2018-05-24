import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog'; 
import { DefaultModalContext } from '@app/shared/modals/models/default-modal-context.model';

@Component({
  selector: 'app-create-swap-confirm',
  templateUrl: './create-swap-confirm.component.html',
  styleUrls: ['./create-swap-confirm.component.scss']
})
export class CreateSwapConfirmComponent implements ModalComponent<DefaultModalContext>, OnInit {

  param: any;

  constructor(public dialog: DialogRef<DefaultModalContext>) { 
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
