import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'; 


@Component({
    selector: 'registration-dialog',
    templateUrl: './registration.dialog.html',
  })
  export class RegistrationDialog {
  
    
    constructor(  
      public dialogRef: MatDialogRef<RegistrationDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any ) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }