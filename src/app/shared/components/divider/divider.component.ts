import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent implements OnInit {
  @Input() showLine: boolean = true;
  @Input() label : string;

  constructor() { }

  ngOnInit() {
  }

}
