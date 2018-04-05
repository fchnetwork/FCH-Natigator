import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-backup-create',
  templateUrl: './backup-create.component.html',
  styleUrls: ['./backup-create.component.scss']
})
export class BackupCreateComponent implements OnInit {

  phrase: string;

  constructor() { }

  ngOnInit() {
    this.phrase = 'choose verb ridge account quiz thumb brand rule amused joy wild movie chimney ripple science';
  }

  public save() {
    
  }
}
