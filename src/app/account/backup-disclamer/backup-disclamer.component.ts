import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { EmptyModalContext } from '../../shared/models/EmptyModalContext';

@Component({
  selector: 'app-backup-disclamer',
  templateUrl: './backup-disclamer.component.html',
  styleUrls: ['./backup-disclamer.component.scss']
})
export class BackupDisclamerComponent implements ModalComponent<EmptyModalContext>, OnInit {
 
  constructor(public dialog: DialogRef<EmptyModalContext>) { 

  }

  ngOnInit() {
  }

  dismiss() {
    this.dialog.close();
  }
}
