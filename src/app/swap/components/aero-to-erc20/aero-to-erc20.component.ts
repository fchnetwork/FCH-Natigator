import { Component, OnInit } from '@angular/core';
import { Guid } from "@shared/helpers/guid";

@Component({
  selector: 'app-aero-to-erc20',
  templateUrl: './aero-to-erc20.component.html',
  styleUrls: ['./aero-to-erc20.component.scss']
})
export class AeroToErc20Component implements OnInit {

  createSwapId: string;

  constructor() { }

  ngOnInit() {
    this.generateSwapId();

  }

  generateSwapId() {
    this.createSwapId = Guid.newGuid();
  }
}
