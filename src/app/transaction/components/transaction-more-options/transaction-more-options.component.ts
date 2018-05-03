import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transaction-more-options',
  templateUrl: './transaction-more-options.component.html',
  styleUrls: ['./transaction-more-options.component.scss']
})
export class TransactionMoreOptionsComponent implements OnInit {

  @Input() data: any;

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onChange(event, type) {
    this.data[type] = event;
    this.ngModelChange.emit(this.data);
  }

}
