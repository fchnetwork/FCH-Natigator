import { Component, OnInit } from '@angular/core';
import { ModalViewComponent, DialogRef } from '@aerum/ui';
import { CreateSwapModalContext } from '@app/wallet/swap/components/create-swap/create-swap.component';

@Component({
  selector: 'app-create-swap-confirm',
  templateUrl: './create-swap-confirm.component.html',
  styleUrls: ['./create-swap-confirm.component.scss']
})
export class CreateSwapConfirmComponent implements ModalViewComponent<CreateSwapModalContext, any>, OnInit {

  constructor(public dialogRef: DialogRef<CreateSwapModalContext, any>) {}

  ngOnInit() {
  }

  onCreate() {
    this.dialogRef.close(null);
  }
}
