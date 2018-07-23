import { Component } from '@angular/core';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { StorageService } from "@core/general/storage-service/storage.service";

const ethUtil = require('ethereumjs-util');
const hdkey   = require("ethereumjs-wallet/hdkey");
const wall    = require("ethereumjs-wallet");
const bip39   = require("bip39");
const Web3    = require('web3');


export interface iDerivedAccounts {
  id: number;
  title: string;
  img: string;
  icon: 'key';
  disabled: boolean;
}


@Component({
  selector: 'app-sidebar-account-select',
  templateUrl: './sidebar-account-select.component.html',
  styleUrls: ['./sidebar-account-select.component.scss']
})
export class SidebarAccountSelectComponent  {

  seed: string;
  existingAccounts: Array<iDerivedAccounts> = [];
  selectResult:any;
  private activeDerivation: string;
    
  constructor(
    private _authSrv: AuthenticationService,
    private storageService: StorageService) {

     this.seed = this.storageService.getSessionData('seed') || '';
     this.existingAccounts = this.storageService.getSessionData('derived_accs') || [];

     const acc_address = this.storageService.getSessionData('acc_address') || '';
     const acc_avatar = this.storageService.getSessionData('acc_avatar') || '';

     this.existingAccounts.push({ id:0, title: acc_address, img: acc_avatar,icon: 'key', disabled: false, });
     let dp = this.storageService.getSessionData('derivation');
        
     this.activeDerivation = (dp != null || dp != undefined) ? dp :  "m/44'/60'/0'/0/0"
   }


  addAddress() {
      const mnemonicToSeed    = bip39.mnemonicToSeed( this.seed );
      const hdwallet          = hdkey.fromMasterSeed( mnemonicToSeed ); 
      const privExtend        = hdwallet.privateExtendedKey();
      const pubExtend         = hdwallet.publicExtendedKey();   
      const currentDerivation = this.activeDerivation.slice(0, -1)
      const derivationPath    = hdwallet.derivePath( currentDerivation + this.existingAccounts.length );
      const initWallet        = derivationPath.getWallet();
      const address           = initWallet.getAddress().toString("hex");
      const checkSumAddress   = ethUtil.toChecksumAddress( address );
      const finalAddress      = ethUtil.addHexPrefix( checkSumAddress );

      this.existingAccounts.push({  id:this.existingAccounts.length, title: finalAddress, img: this._authSrv.generateCryptedAvatar(finalAddress),icon: 'key', disabled: false });

      console.log(this.existingAccounts.length + " " +  JSON.stringify(this.existingAccounts) ); 
      
  }







}
