import { ModalService } from '@shared/services/modal.service';
import { Component, OnInit } from '@angular/core';
import { TokenService } from '@app/dashboard/services/token.service';

@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss']
})
export class TokenListComponent implements OnInit {
  tokens: any;
  constructor(
    public modalService: ModalService,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    this.tokens = this.tokenService.getTokens();
    this.updateTokensBalance();
  }

  updateTokensBalance() {
    this.tokenService.updateTokensBalance().then((res)=>{
      this.tokens = res;
    });
  }

  addToken() {
    this.modalService.openAddToken();
  }

}
