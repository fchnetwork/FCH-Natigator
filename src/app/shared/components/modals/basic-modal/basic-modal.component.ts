import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';


export interface BasicModalContext {
  param?: any;
}

@Component({
  selector: 'aer-basic-modal',
  templateUrl: './basic-modal.component.html',
  styleUrls: ['./basic-modal.component.scss']
})
export class BasicModalComponent implements ModalComponent<BasicModalContext>, OnInit {

  getVariable: any;

  constructor(public dialog: DialogRef<BasicModalContext>) {
    if(dialog.context.param) {
      this.getVariable = dialog.context.param;
    }
  }

  ngOnInit() {
  }

  dismiss(): void {
    this.dialog.dismiss();
  }

}
