import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-aerum-names',
  templateUrl: './manage-aerum-names.component.html',
  styleUrls: ['./manage-aerum-names.component.scss']
})
export class ManageAerumNamesComponent implements OnInit {

  processing: boolean;
  name: string;

  constructor() { }

  ngOnInit() {
  }

  async search() {
    
  }

}
