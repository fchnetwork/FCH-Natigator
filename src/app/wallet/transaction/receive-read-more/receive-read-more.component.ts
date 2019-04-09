import { Component, OnInit } from '@angular/core';
import { ModalViewComponent, DialogRef } from '@aerum/ui';

@Component({
  selector: 'app-receive-read-more',
  templateUrl: './receive-read-more.component.html',
  styleUrls: ['./receive-read-more.component.scss']
})
export class ReceiveReadMoreComponent implements ModalViewComponent<any, any>, OnInit {
  constructor(public dialogRef: DialogRef<any, any>) {}

  ngOnInit() {
  }

  onCreate() {
    this.dialogRef.close(null);
  }
}
