import { Component } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';

export interface iDerivationPaths {
  id: number;
  derivation:string;
  disabled: boolean;
}

@Component({
  selector: 'app-derivation-path',
  templateUrl: './derivation-path.component.html',
  styleUrls: ['./derivation-path.component.scss']
})
export class DerivationPathComponent {

  selectResult: any;
  activeDerivation: string;
  
  derivationPaths: Array<iDerivationPaths> = [{
    id: 1,
    derivation: "m/44'/60'/0'/0/0",
    disabled: false,
  },{
    id: 2,
    derivation: "m/44'/312'/0'/0/0",
    disabled: true,
  }]  
  
    constructor(
      private sessionStorage: SessionStorageService,
      private notificationService: InternalNotificationService ) {
        let storedDerivation = this.sessionStorage.retrieve('derivation');
        let activeDerivation = (storedDerivation != null || storedDerivation != undefined) 
                                ? storedDerivation 
                                : (this.derivationPaths[0].derivation, this.sessionStorage.store('derivation', this.derivationPaths[0].derivation) )
                                 
          this.derivationPaths.forEach( (path, i) => {
            if (path.derivation == activeDerivation ) {
              this.selectResult = this.derivationPaths[i];
            }
          });  
    }

    
  derivationChanged(evt){
    this.sessionStorage.store('derivation', evt.derivation )
    this.notificationService.showMessage(`Derivation path is now ${evt.derivation}`, 'YOUR DERIVATION PATH HAS BEEN MODIFIED');
  }

}
