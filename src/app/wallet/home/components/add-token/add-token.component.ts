import { DialogRef } from 'ngx-modialog'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalComponent } from 'ngx-modialog';
import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { TokenService } from '@app/core/transactions/token-service/token.service';
import { AddressValidator } from "@shared/validators/address.validator";
import { AerumNameService } from "@core/aens/aerum-name-service/aerum-name.service";
import { DefaultModalContext } from '@app/shared/modals/models/default-modal-context.model';

@Component({
  selector: 'app-add-token',
  templateUrl: './add-token.component.html',
  styleUrls: ['./add-token.component.scss']
})
export class AddTokenComponent implements ModalComponent<DefaultModalContext>, OnInit {
  addTokenForm: FormGroup = this.formBuilder.group({});
  tokenAddress: any;
  tokenSymbol: any;
  decimals: any;
  totalSupply: any;
  balance: any;

  constructor(
    public dialog: DialogRef<DefaultModalContext>,
    public formBuilder: FormBuilder,
    private tokenService: TokenService,
    private sessionStorage: SessionStorageService,
    public notificationService: InternalNotificationService,
    private aerumNameService: AerumNameService
  ) { }

  ngOnInit() {
    this.addTokenForm = this.formBuilder.group({
      tokenAddress: [ null, [], [new AddressValidator(this.aerumNameService).isAddressOrAensName]],
      tokenSymbol: [ null, [Validators.required, Validators.minLength(2)]],
      decimals: [ null, [Validators.required]]
    });

    this.addTokenForm.controls['tokenAddress'].valueChanges.subscribe( async (res) => {
      await this.getTokenInfo(res);
    });
  }

  validateTokens() {
    const tokens = this.sessionStorage.retrieve('tokens');
    if(tokens.length) {
      // TODO: handle errors in any styled component
      for(let i = 0; i < tokens.length; i++) {
        if(this.totalSupply <= 0 || !Number.isInteger(this.totalSupply)) {
          this.notificationService.showMessage('Tokens supply has to be bigger than 0');
          return false;
        } else if(this.addTokenForm.value.tokenSymbol === tokens[i].symbol){
          this.notificationService.showMessage('You cannot add token with the same token name');
          return false;
        } else if (this.addTokenForm.value.tokenAddress === tokens[i].address) {
          this.notificationService.showMessage('You cannot add token with the same token address');
          return false;
        }
      }
    }
    return true;
  }

  async onSubmit() {
    const validate = this.validateTokens();
    if (this.addTokenForm.valid && validate) {
      const token = {
        address: await this.aerumNameService.resolveNameOrAddress(this.addTokenForm.value.tokenAddress),
        symbol: this.addTokenForm.value.tokenSymbol,
        decimals: this.addTokenForm.value.decimals,
        balance: this.balance,
      };
      this.tokenService.addToken(token);
      this.dialog.dismiss();
    }
  }

  async getTokenInfo(address) {
    // const address = "0x8414d0b6205d82100f694be759e40a16e31e8d40"; or fab-token.aer
    if(!address) {
      this.clearTokenData();
      return;
    }

    try {
      const resolvedAddress = await this.aerumNameService.resolveNameOrAddress(address);
      if(!resolvedAddress) {
        this.clearTokenData();
        return;
      }

      const res = await this.tokenService.getTokensInfo(resolvedAddress);
      this.fillTokenData(res);
    } catch (e) {
      this.clearTokenData();
      console.log(e);
    }
  }

  private fillTokenData(data: any) {
    this.tokenSymbol = data.symbol;
    this.decimals = data.decimals;
    this.balance = data.balance;
    this.totalSupply = Number(data.totalSupply) || 0;
  }

  private clearTokenData() {
    this.tokenSymbol = '';
    this.decimals = 0;
    this.balance = 0;
    this.totalSupply = 0;
  }

}
