import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalViewComponent } from "@aerum/ui";

import { CreateTokenRequest } from "@app/wallet/factory/models/create-token-request.model";

@Component({
  selector: 'app-create-token-confirm-modal',
  templateUrl: './create-token-confirm-modal.component.html',
  styleUrls: ['./create-token-confirm-modal.component.scss']
})
export class CreateTokenConfirmModalComponent implements ModalViewComponent<CreateTokenRequest, any>, OnInit {

  constructor(public dialogRef: DialogRef<CreateTokenRequest, any>) { }

  ngOnInit() { }

  accept() {
    this.dialogRef.close(null);
  }
}
