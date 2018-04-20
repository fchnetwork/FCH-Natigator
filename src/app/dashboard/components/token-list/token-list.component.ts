import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss']
})
export class TokenListComponent implements OnInit {
  tokens = [
    {
      icon: 'an',
      name: 'Token name',
      amount: 100
    },
    {
      icon: 'an',
      name: 'Token name',
      amount: 100
    },
    {
      icon: 'an',
      name: 'Token name',
      amount: 100
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
