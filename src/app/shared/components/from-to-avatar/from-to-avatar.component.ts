import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-from-to-avatar',
  templateUrl: './from-to-avatar.component.html',
  styleUrls: ['./from-to-avatar.component.scss']
})
export class FromToAvatarComponent implements OnInit {
  @Input() senderAddress: string;
  @Input() recieverAddress: string;

  constructor(public authService: AuthenticationService) { }

  cropAddress(address: string) {
    return address.substr(0, 6) + "..." + address.substr(-4);
  }

  ngOnInit() {
  }

  getSenderAvatar() {
    return this.authService.generateCryptedAvatar(this.senderAddress);
  }

  getReceiverAvatar() {
    return this.authService.generateCryptedAvatar(this.recieverAddress);
  }
}
