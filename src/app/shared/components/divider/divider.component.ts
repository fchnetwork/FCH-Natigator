import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent implements OnInit {
  @Input() showLine = true;
  @Input() label : string;
  @Input() fullWidth = false;

  constructor() { }

  ngOnInit() {
  }

}
