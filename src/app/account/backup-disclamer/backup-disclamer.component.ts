import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog'; 
import { DefaultModalContext } from '@app/shared/modals/models/default-modal-context.model';

@Component({
  selector: 'app-backup-disclamer',
  templateUrl: './backup-disclamer.component.html',
  styleUrls: ['./backup-disclamer.component.scss']
})
export class BackupDisclamerComponent implements ModalComponent<DefaultModalContext>, OnInit {
 
  constructor(public dialog: DialogRef<DefaultModalContext>) { 

  }

  ngOnInit() {
  }

  dismiss() {
    this.dialog.close();
  }
}
