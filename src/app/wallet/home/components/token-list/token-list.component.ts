import { Component, OnInit } from '@angular/core';    
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { TokenService } from '@app/core/transactions/token-service/token.service';

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

    const toke = this.tokenService.tokens$;
          toke.subscribe( res => {
            this.tokens = res || [];
          });

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

  deleteToken(token) {
    this.tokenService.deleteToken(token);
  }

}
