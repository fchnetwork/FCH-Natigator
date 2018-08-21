import { Component, Input } from '@angular/core';
import { Token } from "@core/transactions/token-service/token.model";

@Component({
  selector: 'app-token-description',
  templateUrl: './token-description.component.html',
  styleUrls: ['./token-description.component.scss']
})
export class TokenDescriptionComponent {

  @Input() token: Token;

  constructor() { }
}
