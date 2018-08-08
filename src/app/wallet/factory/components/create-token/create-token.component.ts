import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.scss']
})
export class CreateTokenComponent implements OnInit {

  name: string;
  symbol: string;
  supply: number;
  decimals: number;
  address: string;

  constructor() { }

  ngOnInit() {
  }

  async createToken() {
    this.address = "abc";
  }
}
