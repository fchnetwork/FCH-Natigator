import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { StorageService } from "@core/general/storage-service/storage.service";
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';

@Component({
  selector: 'aer-sidebar-header',
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.scss']
})
export class SidebarHeaderComponent implements OnInit {
  @Input()isToggled = false;
  @Output() headerFn: EventEmitter<any> = new EventEmitter();

  avatar: string;
  address: string;
  name: string;

  constructor(
    public authServ: AuthenticationService,
    public storageService: StorageService) {}

  ngOnInit() {
    this.address = this.storageService.getSessionData('acc_address');
    this.avatar = this.storageService.getSessionData('acc_avatar');
    this.name = this.authServ.getName();
    // if(!this.address) {
    //   this.sessionStorageService.observe('acc_address').subscribe((value)=>{
    //     this.address = this.sessionStorageService.retrieve('acc_address');
    //     this.avatar = avatars.create(this.address);
    //   });
  }

  public callFunction() {
    this.headerFn.emit();
  }

}
