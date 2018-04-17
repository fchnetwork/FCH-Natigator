import { Component, OnInit } from '@angular/core';
import * as avatars from 'identity-img';
import { AuthenticationService } from '@account/services/authentication-service/authentication.service';
import * as CryptoJS from 'crypto-js';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'aer-sidebar-header',
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.scss']
})
export class SidebarHeaderComponent implements OnInit {
  avatar: string;
  address: string;
  
  constructor( public authServ: AuthenticationService) {
    avatars.config({ size: 67 * 3, bgColor: '#fff' });
   }

  ngOnInit() {
    this.address = sessionStorage.getItem('acc_address');
    this.avatar = avatars.create(this.address);
  }

}
