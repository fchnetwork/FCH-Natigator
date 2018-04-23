import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  diagnosticsServer: string = "http://stats.aerum.net:3000/";

  constructor() { }

  ngOnInit() {
  }

}
