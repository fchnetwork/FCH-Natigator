import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-password-lines',
  templateUrl: './password-lines.component.html',
  styleUrls: ['./password-lines.component.scss']
})
export class PasswordLinesComponent implements OnInit {
  @Input() passClass: string = 'very_weak';
  
  constructor() { }

  ngOnInit() {
  }

}
