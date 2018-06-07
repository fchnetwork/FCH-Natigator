import { Component, OnInit } from '@angular/core';    
import { ModalService } from '@core/general/modal-service/modal.service';
import { TokenService } from '@core/transactions/token-service/token.service';
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';

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
    public clipboardService: ClipboardService,
    public notificationService: InternalNotificationService
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

  copyTokenAddress(token) {
    this.clipboardService.copy(token);
    this.notificationService.showMessage('Copied to clipboard!', 'Done');
  }

}
