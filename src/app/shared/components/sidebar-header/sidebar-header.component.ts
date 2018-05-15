import { Component, OnInit } from '@angular/core';
import * as avatars from 'identity-img';
import * as CryptoJS from 'crypto-js';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SessionStorageService } from 'ngx-webstorage'; 
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';

@Component({
  selector: 'aer-sidebar-header',
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.scss']
})
export class SidebarHeaderComponent implements OnInit {
  avatar: string;
  address: string;
  
  constructor(
    public authServ: AuthenticationService,
    public sessionStorageService: SessionStorageService ) {}

  ngOnInit() {
    this.address = this.sessionStorageService.retrieve('acc_address');
    this.avatar = this.sessionStorageService.retrieve('acc_avatar');
    // if(!this.address) {
    //   this.sessionStorageService.observe('acc_address').subscribe((value)=>{
    //     this.address = this.sessionStorageService.retrieve('acc_address');
    //     this.avatar = avatars.create(this.address);
    //   });
  }

}
