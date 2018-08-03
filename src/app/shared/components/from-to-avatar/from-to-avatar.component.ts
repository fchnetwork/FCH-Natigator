import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { AerumNameService } from '@app/core/aens/aerum-name-service/aerum-name.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-from-to-avatar',
  templateUrl: './from-to-avatar.component.html',
  styleUrls: ['./from-to-avatar.component.scss']
})
export class FromToAvatarComponent implements OnInit {
  private _senderAddress: string;
  private _recieverAddress: string;

  senderAddressAvatar: string;
  recieverAddressAvatar: string;

  @Input() set senderAddress(value: string) {
    this._senderAddress = value;
    this.updateSenderAvatar();
  }

  @Input() set recieverAddress(value: string) {
    this._recieverAddress = value;
    this.updateReceiverAvatar();
  }

  get senderCropedAddress() {
    return this.cropAddress(this._senderAddress);
  }

  get recieverCropedAddress() {
    return this.cropAddress(this._recieverAddress);
  }

  constructor(public authService: AuthenticationService,
    private nameService: AerumNameService)
  { }

  ngOnInit() 
  { }

  private cropAddress(address: string) {
    if(this.nameService.isAensName(address)){
      return address;
    }
    return address ? address.substr(0, 6) + "..." + address.substr(-4) : '';
  }

  private async updateSenderAvatar() {
    const address = await this.nameService.safeResolveNameOrAddress(this._senderAddress);
    this.senderAddressAvatar = address ? `url(${this.authService.generateCryptedAvatar(address)})` : '';
  }

  private async updateReceiverAvatar() {
    const address = await this.nameService.safeResolveNameOrAddress(this._recieverAddress);
    this.recieverAddressAvatar = address ? `url(${this.authService.generateCryptedAvatar(address)})` : '';
  }
}
